#!/usr/bin/env python
from socket import gethostbyname
import sys
import json
import struct

SCOPE_FILE = "/tmp/ff_scope"
scope = None

## make it python2/3 agnostic
try:
    out_stream = sys.stdout.buffer
    in_stream = sys.stdin.buffer
    err_stream = sys.stderr.buffer
except AttributeError:
    out_stream = sys.stdout
    in_stream = sys.stdin
    err_stream = sys.stderr

def log(msg):
    err_stream.write(msg)
    err_stream.write("\n")
    err_stream.flush()

def recv_msg():
    len_buff = in_stream.read(4)
    if len(len_buff) == 0:
        sys.exit(0)
    l = struct.unpack('@I', len_buff)[0]
    msg = in_stream.read(l)
    return json.loads(msg)

def check_scope(ip):
    global scope
    if not scope: return None
    return ip in scope

def load_scope(fname):
    global scope
    scope = []
    try:
        with open(fname) as fp:
            for i in fp.readlines():
                scope.append(i.strip())
    except IOError: 
        pass

def parse_msg(msg):
    if msg["verb"] == "check":
        msg["ip"] = gethostbyname(msg["domain"])
        msg["inscope"] = check_scope(msg["ip"])
        send_msg(msg)
    elif msg["verb"] == "reload":
        load_scope(SCOPE_FILE)
        send_msg(msg)

def send_msg(msg):
    content = json.dumps(msg)
    size = struct.pack('@I', len(content))
    out_stream.write(size)
    out_stream.write(content)
    out_stream.flush()

load_scope(SCOPE_FILE)
while True:
    msg = recv_msg()
    if not msg: continue
    parse_msg(msg)
