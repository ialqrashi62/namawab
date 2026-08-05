"""Test for pcc-sdk"""
from pcc_sdk import PccClient
import sys

client = PccClient(base_url="http://localhost:3201")
pass_count = 0
fail_count = 0

def test(name, fn):
    global pass_count, fail_count
    try:
        fn()
        print(f"PASS {name}")
        pass_count += 1
    except Exception as e:
        print(f"FAIL {name} - {e}")
        fail_count += 1

def t_health():
    h = client.health()
    assert h["status"] == "ok", h

def t_catalog():
    c = client.catalog()
    assert c["count"] == 1322, c["count"]

def t_call():
    r = client.call("pcc-cardiology-ext102", "CardGenExt", {"hr": 80})
    assert "score" in r, r

test("health", t_health)
test("catalog", t_catalog)
test("call", t_call)

print("---")
print(f"Total: {pass_count + fail_count} PASS: {pass_count} FAIL: {fail_count}")
sys.exit(0 if fail_count == 0 else 1)
