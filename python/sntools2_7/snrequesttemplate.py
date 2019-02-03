#!/usr/bin/evn python
# -*- coding:utf-8 -*-

from snpack2_7 import *
from snspider2_7 import *

# 只是忽略 https
ssl._create_default_https_context = ssl._create_unverified_context
# --------------------------------------------------------------------------------

# 可以是User-Agent列表，也可以是代理列表
ua_list = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Mozilla/5.0 (Windows NT 6.1; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
    "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
]


def request_normal(url):
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    ua_headers = {
        'User-Agent': user_agent
    }
    request = urllib2.Request(url, headers = ua_headers)
    response = urllib2.urlopen(request)
    html = response.read()
    
    return html


def request_with_proxy(url):
    proxy_switch = False
    # 免费代理
    # http://www.xicidaili.com/
    
    if proxy_switch:
        proxy_handler = urllib2.ProxyHandler({
            'http': '114.113.126.82',
        })
    else:
        proxy_handler = urllib2.ProxyHandler({})
    
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    ua_headers = {
        'User-Agent': user_agent
    }
    
    opener = urllib2.build_opener(proxy_handler)
    # 构建了一个全局的openner, 之后所有的请求都可以用urlopen()方式去发送, 也附带Handler的功能
    # urllib2.install_opener(opener)
    
    request = urllib2.Request(url, headers = ua_headers)
    
    response = opener.open(request)
    
    html = response.read()
    
    return html


def request_with_cookie(url):
    # 通过CookieJar()类构建一个cookieJar()对象, 用来保存cookie的值
    cookie = cookielib.CookieJar()
    
    # 通过HTTPCookieProcessor()处理器类构建一个处理器对象, 用来处理cookie
    # 参数是构建的CookieJar()对象
    cookie_handler = urllib2.HTTPCookieProcessor(cookie)
    
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    # ua_headers = {
    #     'User-Agent': user_agent
    # }
    
    # http_handler = urllib2.HTTPHandler(debuglevel = 1)
    
    opener = urllib2.build_opener(cookie_handler)
    
    opener.addheaders = [
        ('User-Agent', user_agent)
    ]
    data = {
        'email'   : '111111',  # 182
        'password': '111111',  # cm0
    }
    
    data = urlencode(data)
    
    # 构建了一个全局的openner, 之后所有的请求都可以用urlopen()方式去发送, 也附带Handler的功能
    # urllib2.install_opener(opener)
    
    request = urllib2.Request(url, data = data)
    
    response = opener.open(request)
    
    # html = response.read()
    
    # mlog(fm(), '''to_utf8(html) = {}'''.format(to_utf8(html)))
    
    opener_open = opener.open('http://www.renren.com/237326065/profile')
    
    # print opener_open.read()


def request_with_session(url):
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    ua_headers = {
        'User-Agent': user_agent
    }
    sess = requests.Session()
    
    # .content .text(返回的是unicode, 不好转换 )两种方式
    html = sess.get(url, headers = ua_headers).content
    
    return html


def request_with_debug(url):
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    ua_headers = {
        'User-Agent': user_agent
    }
    
    http_handler = urllib2.HTTPHandler(debuglevel = 1)
    opener = urllib2.build_opener(http_handler)
    request = urllib2.Request(url, headers = ua_headers)
    response = opener.open(request)
    
    html = response.read()
    
    return html


def request_with_post(url):
    formdata = {
        "i"          : '韩国',
        "from"       : "AUTO",
        "to"         : "AUTO",
        "smartresult": "dict",
        "client"     : "fanyideskweb",
        "salt"       : "1535787261047",
        "sign"       : "a265851338cd5fff8f7cba6449920110",
        "doctype"    : "json",
        "version"    : "2.1",
        "keyfrom"    : "fanyi.web",
        "action"     : "FY_BY_CLICKBUTTION",
        "typoResult" : "false",
    }
    
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    ua_headers = {
        'User-Agent'      : user_agent,
        "Host"            : "fanyi.youdao.com",
        "Connection"      : "keep-alive",
        "Accept"          : "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type"    : "application/x-www-form-urlencoded; charset=UTF-8",
        # "Content-Length"  : "218",
        # "Accept-Encoding" : "gzip, deflate",
        "Accept-Language" : "zh-CN,zh;q=0.9,ko;q=0.8,en;q=0.7",
        "Cookie"          : """OUTFOX_SEARCH_USER_ID_NCOO=1937516393.3418703; OUTFOX_SEARCH_USER_ID="-2082144491@10.168.11.12"; ___rl__test__cookies=1535786957925""",
        "Origin"          : "http//fanyi.youdao.com",
        "Referer"         : "http//fanyi.youdao.com/",
    }
    
    data = urllib.urlencode(formdata)
    request = urllib2.Request(url, headers = ua_headers, data = data)
    response = urllib2.urlopen(request)
    html = response.read()
    
    return html


def request_with_shadowsocks(url):
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    ua_headers = {
        'User-Agent': user_agent
    }
    sess = requests.Session()
    
    proxies = {
        "http" : "socks5://127.0.0.1:1086",
        'https': 'socks5://127.0.0.1:1086'
    }
    # .content .text(返回的是unicode, 不好转换 )两种方式
    # html = sess.get('http://xn--cckl0itdpc.jpn.com/', headers = ua_headers, proxies = proxies).content
    html = sess.get(url, headers = ua_headers, proxies = proxies).content
    return html


if __name__ == "__main__":
    
    request_normal('http://www.27270.com/ent/meinvtupian')
    request_with_proxy('http://www.27270.com/ent/meinvtupian')
    request_with_cookie('http://www.27270.com/ent/meinvtupian')
    request_with_session('http://www.27270.com/ent/meinvtupian')
    request_with_shadowsocks('https://e-hentai.org/lofi/')
    
    print("\033[1;44;97m %s \033[0m" % 'The End')
