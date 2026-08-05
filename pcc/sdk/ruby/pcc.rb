#!/usr/bin/env ruby
# frozen_string_literal: true

# pcc-sdk (Ruby) — SDK for NamaMedical PCC Sandbox
# Auto-generated for PCC Catalog v3.316.0
# 1322 modules, 10035 unique functions
# Generated: 2026-07-29T05:45:07.520Z

require 'net/http'
require 'uri'
require 'json'

module Pcc
  # Custom error class
  class Error < StandardError; end

  # Client class for PCC Sandbox
  class Client
    attr_accessor :base_url, :headers, :timeout

    def initialize(base_url: 'http://localhost:3201', headers: {}, timeout: 30)
      @base_url = base_url
      @headers = headers
      @timeout = timeout
    end

    # === Catalog ===
    def catalog
      get('/api/v1/pcc-catalog/modules')
    end

    def categories
      get('/api/v1/pcc-catalog/categories')
    end

    def module(slug)
      get("/api/v1/pcc-catalog/module/#{slug}")
    end

    # === Search ===
    def search(query)
      get('/api/v1/pcc-catalog/search?q=' + URI.encode_www_form_component(query))
    end

    def lookup(fn)
      get('/api/v1/pcc-catalog/lookup/' + URI.encode_www_form_component(fn))
    end

    # === Diagnostics ===
    def diagnostics
      get('/api/v1/pcc-diagnostics/diagnostics')
    end

    def version
      get('/api/v1/pcc-diagnostics/version')
    end

    # === Module operations ===
    def list_module(slug)
      get("/api/v1/#{slug}/list")
    end

    def call(slug, fn, input = {})
      post("/api/v1/#{slug}/call/#{fn}", input)
    end

    def record(slug, request)
      post("/api/v1/#{slug}/record", request)
    end

    def health
      get('/health')
    end

    private

    def get(path)
      request(:get, path, nil)
    end

    def post(path, body)
      request(:post, path, body)
    end

    def request(method, path, body)
      uri = URI.parse(@base_url + path)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = @timeout

      req =
        case method
        when :get
          Net::HTTP::Get.new(uri.request_uri)
        when :post
          r = Net::HTTP::Post.new(uri.request_uri)
          r['Content-Type'] = 'application/json'
          r.body = JSON.generate(body) if body
          r
        end

      @headers.each { |k, v| req[k] = v }

      res = http.request(req)
      unless res.is_a?(Net::HTTPSuccess)
        raise Error, "PCC #{method} #{path} failed: #{res.code} #{res.body}"
      end
      res.body && !res.body.empty? ? JSON.parse(res.body) : nil
    end
  end
end
