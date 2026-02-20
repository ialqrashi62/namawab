#pragma once
// ============================================================
// Minimal QR Code generator  –  header-only, zero dependencies
// Based on Nayuki's QR Code generator (public domain).
// Simplified to support ONLY byte-mode, ECC-M, auto-version.
// Returns a QImage suitable for embedding in a QPainter scene.
// ============================================================

#include <QByteArray>
#include <QImage>
#include <QPainter>
#include <algorithm>
#include <cstdint>
#include <cstring>
#include <vector>

namespace QrCode {

// ---- GF(256) helpers (QR uses 0x11D polynomial) ----
static inline uint8_t gfMul(uint8_t a, uint8_t b) {
  uint16_t r = 0;
  for (int i = 7; i >= 0; i--) {
    r = (r << 1) ^ ((r >> 7) * 0x11D);
    r ^= ((b >> i) & 1) * a;
  }
  return (uint8_t)r;
}

// Reed-Solomon generator polynomial coefficients
static inline std::vector<uint8_t> rsGenPoly(int degree) {
  std::vector<uint8_t> g(degree, 0);
  g[degree - 1] = 1;
  uint8_t root = 1;
  for (int i = 0; i < degree; i++) {
    for (int j = 0; j < degree; j++) {
      g[j] = gfMul(g[j], root);
      if (j + 1 < degree)
        g[j] ^= g[j + 1];
    }
    root = gfMul(root, 2);
  }
  return g;
}

static inline std::vector<uint8_t>
rsRemainder(const std::vector<uint8_t> &data, const std::vector<uint8_t> &gen) {
  std::vector<uint8_t> r(gen.size(), 0);
  for (uint8_t b : data) {
    uint8_t f = b ^ r[0];
    r.erase(r.begin());
    r.push_back(0);
    for (size_t i = 0; i < r.size(); i++)
      r[i] ^= gfMul(gen[i], f);
  }
  return r;
}

// ---- Bit buffer ----
struct BitBuf {
  std::vector<uint8_t> bytes;
  int bitLen = 0;
  void append(uint32_t val, int len) {
    for (int i = len - 1; i >= 0; i--) {
      int byteIdx = bitLen / 8;
      int bitIdx = 7 - (bitLen % 8);
      if (byteIdx >= (int)bytes.size())
        bytes.push_back(0);
      if ((val >> i) & 1)
        bytes[byteIdx] |= (1 << bitIdx);
      bitLen++;
    }
  }
};

// ---- QR version / ECC parameters (ECC level M only) ----
struct VersionInfo {
  int ver, totalCW, ecCWperBlock, numBlocks1, dcInBlock1, numBlocks2,
      dcInBlock2;
};

// ECC-M parameters for versions 1..20 (enough for ZATCA invoices)
static const VersionInfo VER_TABLE[] = {
    {1, 26, 10, 1, 16, 0, 0},     {2, 44, 16, 1, 28, 0, 0},
    {3, 70, 26, 1, 44, 0, 0},     {4, 100, 18, 2, 32, 0, 0},
    {5, 134, 24, 2, 43, 0, 0},    {6, 172, 16, 4, 27, 0, 0},
    {7, 196, 18, 4, 31, 0, 0},    {8, 242, 22, 2, 38, 2, 39},
    {9, 292, 22, 3, 36, 2, 37},   {10, 346, 26, 4, 43, 1, 44},
    {11, 404, 30, 1, 50, 4, 51},  {12, 466, 22, 6, 36, 2, 37},
    {13, 532, 22, 8, 37, 1, 38},  {14, 581, 24, 4, 40, 5, 41},
    {15, 655, 24, 5, 41, 5, 42},  {16, 733, 28, 7, 45, 3, 46},
    {17, 815, 28, 10, 46, 1, 47}, {18, 901, 26, 9, 43, 4, 44},
    {19, 991, 26, 3, 44, 11, 45}, {20, 1085, 28, 3, 41, 13, 42},
};

static inline int dataCW(const VersionInfo &v) {
  int totalEC = v.ecCWperBlock * (v.numBlocks1 + v.numBlocks2);
  return v.totalCW - totalEC;
}

// Find smallest version that fits dataLen bytes (byte mode)
static inline const VersionInfo &pickVersion(int dataLen) {
  for (auto &v : VER_TABLE) {
    int cap = dataCW(v);
    // byte mode overhead: 4-bit mode + char-count bits + data
    int ccBits = (v.ver <= 9) ? 8 : 16;
    int needed = (4 + ccBits + dataLen * 8 + 7) / 8;
    if (needed <= cap)
      return v;
  }
  return VER_TABLE[19]; // max
}

// ---- Module matrix manipulation ----
struct QrMatrix {
  int size;
  std::vector<uint8_t> mod; // 1=dark, 0=light
  std::vector<bool> func;   // true=function pattern (not masked)

  QrMatrix(int s) : size(s), mod(s * s, 0), func(s * s, false) {}
  void set(int x, int y, bool dark, bool isFunc) {
    mod[y * size + x] = dark ? 1 : 0;
    func[y * size + x] = isFunc;
  }
  bool get(int x, int y) const { return mod[y * size + x]; }
  bool isFunc2(int x, int y) const { return func[y * size + x]; }

  void drawFinderPattern(int cx, int cy) {
    for (int dy = -4; dy <= 4; dy++)
      for (int dx = -4; dx <= 4; dx++) {
        int x = cx + dx, y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size)
          continue;
        int ax = abs(dx), ay = abs(dy);
        bool dark = (std::max(ax, ay) != 2 && std::max(ax, ay) != 4);
        set(x, y, dark, true);
      }
  }

  void drawAlignmentPattern(int cx, int cy) {
    for (int dy = -2; dy <= 2; dy++)
      for (int dx = -2; dx <= 2; dx++) {
        bool dark = (abs(dx) == 2 || abs(dy) == 2) ? true
                    : (dx == 0 && dy == 0)         ? true
                                                   : false;
        set(cx + dx, cy + dy, dark, true);
      }
  }

  void drawTimingPatterns() {
    for (int i = 0; i < size; i++) {
      if (!func[6 * size + i])
        set(i, 6, i % 2 == 0, true);
      if (!func[i * size + 6])
        set(6, i, i % 2 == 0, true);
    }
  }

  void drawFormatBits(int mask) {
    // ECC level M = 0, mask 0-7
    int data = (0 << 3) | mask; // ECC M = 00
    int rem = data;
    for (int i = 0; i < 10; i++)
      rem = (rem << 1) ^ ((rem >> 9) * 0x537);
    int bits = ((data << 10) | rem) ^ 0x5412;
    for (int i = 0; i < 6; i++)
      set(8, i, ((bits >> i) & 1), true);
    set(8, 7, (bits >> 6) & 1, true);
    set(8, 8, (bits >> 7) & 1, true);
    set(7, 8, (bits >> 8) & 1, true);
    for (int i = 9; i < 15; i++)
      set(14 - i, 8, (bits >> i) & 1, true);

    for (int i = 0; i < 8; i++)
      set(size - 1 - i, 8, (bits >> i) & 1, true);
    set(8, size - 7, (bits >> 8) & 1, true);
    for (int i = 9; i < 15; i++)
      set(8, size - 15 + i, (bits >> i) & 1, true);
    set(8, size - 8, 1, true); // dark module
  }

  void drawVersionBits(int ver) {
    if (ver < 7)
      return;
    int rem = ver;
    for (int i = 0; i < 12; i++)
      rem = (rem << 1) ^ ((rem >> 11) * 0x1F25);
    int bits = (ver << 12) | rem;
    for (int i = 0; i < 18; i++) {
      bool b = (bits >> i) & 1;
      int a = size - 11 + i % 3, bc = i / 3;
      set(a, bc, b, true);
      set(bc, a, b, true);
    }
  }

  void applyMask(int mask) {
    for (int y = 0; y < size; y++)
      for (int x = 0; x < size; x++) {
        if (func[y * size + x])
          continue;
        bool inv = false;
        switch (mask) {
        case 0:
          inv = (x + y) % 2 == 0;
          break;
        case 1:
          inv = y % 2 == 0;
          break;
        case 2:
          inv = x % 3 == 0;
          break;
        case 3:
          inv = (x + y) % 3 == 0;
          break;
        case 4:
          inv = (x / 3 + y / 2) % 2 == 0;
          break;
        case 5:
          inv = x * y % 2 + x * y % 3 == 0;
          break;
        case 6:
          inv = (x * y % 2 + x * y % 3) % 2 == 0;
          break;
        case 7:
          inv = ((x + y) % 2 + x * y % 3) % 2 == 0;
          break;
        }
        if (inv)
          mod[y * size + x] ^= 1;
      }
  }

  long penalty() const {
    long p = 0;
    for (int y = 0; y < size; y++) {
      for (int x = 0; x < size - 4; x++) {
        bool same = true;
        for (int k = 1; k < 5; k++)
          if (get(x + k, y) != get(x, y)) {
            same = false;
            break;
          }
        if (same)
          p += 3;
      }
    }
    for (int x = 0; x < size; x++) {
      for (int y = 0; y < size - 4; y++) {
        bool same = true;
        for (int k = 1; k < 5; k++)
          if (get(x, y + k) != get(x, y)) {
            same = false;
            break;
          }
        if (same)
          p += 3;
      }
    }
    int dark = 0;
    for (auto m : mod)
      dark += m;
    int total = size * size;
    int pct = (dark * 200 - total * 100) / total;
    if (pct < 0)
      pct = -pct;
    p += (pct / 5) * 10;
    return p;
  }
};

// Alignment pattern positions
static inline std::vector<int> alignPositions(int ver) {
  if (ver == 1)
    return {};
  int n = ver / 7 + 2;
  int step = (ver == 32) ? 26 : (ver * 4 + n * 2 + 1) / (2 * n - 2) * 2;
  std::vector<int> pos;
  int s = ver * 4 + 10;
  for (int i = n - 1, p = s - 7; i >= 1; i--, p -= step)
    pos.push_back(p);
  pos.push_back(6);
  std::reverse(pos.begin(), pos.end());
  return pos;
}

// ---- Main encode function ----
static inline QImage encode(const QByteArray &data, int pixelsPerModule = 8) {
  const VersionInfo &vi = pickVersion(data.size());
  int ver = vi.ver;
  int sz = ver * 4 + 17;

  // Build data codewords
  BitBuf bb;
  bb.append(0b0100, 4); // byte mode
  int ccBits = (ver <= 9) ? 8 : 16;
  bb.append(data.size(), ccBits);
  for (int i = 0; i < data.size(); i++)
    bb.append((uint8_t)data[i], 8);

  int dcTotal = dataCW(vi);
  // Terminator
  int termBits = std::min(4, dcTotal * 8 - bb.bitLen);
  bb.append(0, termBits);
  // Pad to byte boundary
  if (bb.bitLen % 8 != 0)
    bb.append(0, 8 - bb.bitLen % 8);
  // Pad bytes
  while ((int)bb.bytes.size() < dcTotal) {
    bb.bytes.push_back(0xEC);
    if ((int)bb.bytes.size() < dcTotal)
      bb.bytes.push_back(0x11);
  }
  bb.bytes.resize(dcTotal);

  // Split into blocks and compute ECC
  auto gen = rsGenPoly(vi.ecCWperBlock);
  std::vector<std::vector<uint8_t>> dataBlocks, ecBlocks;
  int offset = 0;
  for (int g = 0; g < 2; g++) {
    int nb = (g == 0) ? vi.numBlocks1 : vi.numBlocks2;
    int dc = (g == 0) ? vi.dcInBlock1 : vi.dcInBlock2;
    if (dc == 0)
      continue;
    for (int b = 0; b < nb; b++) {
      std::vector<uint8_t> block(bb.bytes.begin() + offset,
                                 bb.bytes.begin() + offset + dc);
      offset += dc;
      dataBlocks.push_back(block);
      ecBlocks.push_back(rsRemainder(block, gen));
    }
  }

  // Interleave
  std::vector<uint8_t> codewords;
  int maxDC = std::max(vi.dcInBlock1, vi.dcInBlock2);
  for (int i = 0; i < maxDC; i++)
    for (auto &b : dataBlocks)
      if (i < (int)b.size())
        codewords.push_back(b[i]);
  for (int i = 0; i < vi.ecCWperBlock; i++)
    for (auto &b : ecBlocks)
      codewords.push_back(b[i]);

  // Draw matrix
  QrMatrix mat(sz);
  mat.drawFinderPattern(3, 3);
  mat.drawFinderPattern(sz - 4, 3);
  mat.drawFinderPattern(3, sz - 4);

  auto aps = alignPositions(ver);
  for (int ay : aps)
    for (int ax : aps) {
      if ((ax < 8 && ay < 8) || (ax < 8 && ay > sz - 9) ||
          (ax > sz - 9 && ay < 8))
        continue;
      mat.drawAlignmentPattern(ax, ay);
    }

  mat.drawTimingPatterns();

  // Reserve format / version areas
  for (int i = 0; i < 8; i++) {
    mat.set(8, i, false, true);
    mat.set(i, 8, false, true);
    mat.set(sz - 1 - i, 8, false, true);
    mat.set(8, sz - 1 - i, false, true);
  }
  mat.set(8, 8, false, true);
  mat.drawVersionBits(ver);

  // Place data bits
  int bitIdx = 0;
  for (int right = sz - 1; right >= 1; right -= 2) {
    if (right == 6)
      right = 5;
    for (int vert = 0; vert < sz; vert++) {
      for (int j = 0; j < 2; j++) {
        int x = right - j;
        bool upward = ((right + 1) / 2) % 2 == (ver < 7 ? 1 : 0);
        // Adjust: columns counted from right
        int colPair = (sz - 1 - right) / 2;
        upward = (colPair % 2 == 0);
        int y = upward ? (sz - 1 - vert) : vert;
        if (x < 0 || x >= sz || y < 0 || y >= sz)
          continue;
        if (mat.isFunc2(x, y))
          continue;
        bool dark = false;
        if (bitIdx < (int)codewords.size() * 8) {
          dark = (codewords[bitIdx / 8] >> (7 - bitIdx % 8)) & 1;
          bitIdx++;
        }
        mat.set(x, y, dark, false);
      }
    }
  }

  // Try all masks, pick best
  int bestMask = 0;
  long bestPen = LONG_MAX;
  QrMatrix best = mat;
  for (int m = 0; m < 8; m++) {
    QrMatrix tmp = mat;
    tmp.applyMask(m);
    tmp.drawFormatBits(m);
    long pen = tmp.penalty();
    if (pen < bestPen) {
      bestPen = pen;
      bestMask = m;
      best = tmp;
    }
  }
  (void)bestMask;

  // Render to QImage
  int border = 4;
  int imgSz = (sz + border * 2) * pixelsPerModule;
  QImage img(imgSz, imgSz, QImage::Format_RGB32);
  img.fill(Qt::white);
  QPainter p(&img);
  p.setPen(Qt::NoPen);
  p.setBrush(Qt::black);
  for (int y = 0; y < sz; y++)
    for (int x = 0; x < sz; x++)
      if (best.get(x, y))
        p.drawRect((x + border) * pixelsPerModule,
                   (y + border) * pixelsPerModule, pixelsPerModule,
                   pixelsPerModule);
  p.end();
  return img;
}

} // namespace QrCode
