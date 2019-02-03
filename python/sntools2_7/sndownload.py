#!/usr/bin/evn python
# -*- coding:utf-8 -*-

from snpack2_7 import *
from snspider2_7 import *
import subprocess

tests = []


def test_jpeg(h, f):
    """JPEG data in JFIF format"""
    if h[6:10] == 'JFIF':
        return 'jpeg'


tests.append(test_jpeg)


def test_exif(h, f):
    """JPEG data in Exif format"""
    if h[6:10] == 'Exif':
        return 'jpeg'


tests.append(test_exif)


def test_png(h, f):
    if h[:8] == "\211PNG\r\n\032\n":
        return 'png'


tests.append(test_png)


def test_gif(h, f):
    """GIF ('87 and '89 variants)"""
    if h[:6] in ('GIF87a', 'GIF89a'):
        return 'gif'


tests.append(test_gif)


def test_tiff(h, f):
    """TIFF (can be in Motorola or Intel byte order)"""
    if h[:2] in ('MM', 'II'):
        return 'tiff'


tests.append(test_tiff)


def test_rgb(h, f):
    """SGI image library"""
    if h[:2] == '\001\332':
        return 'rgb'


tests.append(test_rgb)


def test_pbm(h, f):
    """PBM (portable bitmap)"""
    if len(h) >= 3 and \
            h[0] == 'P' and h[1] in '14' and h[2] in ' \t\n\r':
        return 'pbm'


tests.append(test_pbm)


def test_pgm(h, f):
    """PGM (portable graymap)"""
    if len(h) >= 3 and \
            h[0] == 'P' and h[1] in '25' and h[2] in ' \t\n\r':
        return 'pgm'


tests.append(test_pgm)


def test_ppm(h, f):
    """PPM (portable pixmap)"""
    if len(h) >= 3 and \
            h[0] == 'P' and h[1] in '36' and h[2] in ' \t\n\r':
        return 'ppm'


tests.append(test_ppm)


def test_rast(h, f):
    """Sun raster file"""
    if h[:4] == '\x59\xA6\x6A\x95':
        return 'rast'


tests.append(test_rast)


def test_xbm(h, f):
    """X bitmap (X10 or X11)"""
    s = '#define '
    if h[:len(s)] == s:
        return 'xbm'


tests.append(test_xbm)


def test_bmp(h, f):
    if h[:2] == 'BM':
        return 'bmp'


tests.append(test_bmp)


def __make_sure(path):
    is_exists = os.path.exists(path)
    if not is_exists:
        return path
    else:
        return __make_sure(path + '_copy')


def __mkdir(path):
    # 去除首尾空格
    path = path.strip()
    # 去除尾部 / 符号
    path = path.rstrip("/")
    sure = __make_sure(path)
    os.makedirs(sure)
    
    return sure


def get_file_name(url):
    i = url.rindex('/')
    file_name = url[i + 1:]
    
    i = file_name.rfind('.')
    
    if i == -1:
        extension_name = ''
    else:
        extension_name = file_name[i + 1:]
    
    return (file_name, extension_name)


def get_data(url):
    ssl._create_default_https_context = ssl._create_unverified_context
    
    # 可以是User-Agent列表，也可以是代理列表
    ua_list = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
        "Mozilla/5.0 (Windows NT 6.1; rv2.0.1) Gecko/20100101 Firefox/4.0.1",
        "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11",
        "Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    ]
    
    # 在User-Agent列表里随机选择一个User-Agent
    user_agent = random.choice(ua_list)
    
    ua_headers = {
        'User-Agent': user_agent
    }
    
    proxies = {
        "http" : "socks5://127.0.0.1:1086",
        'https': 'socks5://127.0.0.1:1086'
    }
    
    # request = urllib2.Request(url, headers = ua_headers)
    # response = urllib2.urlopen(request)
    # return response.read()
    
    try:
        sess = requests.Session()
        html = sess.get(url, headers = ua_headers, proxies = proxies).content
        return html
    except Exception as e:
        # print("\033[1;97;41m【" + type(e).__name__ + "】error: %s \033[0m" % str(e))
        pass
    
    print '-' * 36
    sess = requests.Session()
    html = sess.get(url, headers = ua_headers).content
    return html


def image_download(url, directory, file_name = None):
    # dir = __mkdir(directory)
    dir = directory
    
    fname, extension_name = get_file_name(url)
    
    data = get_data(url)
    
    for tf in tests:
        res = tf(data, None)
        if res:
            extension_name = res
    
    if file_name:
        i = file_name.rindex('.')
        fn = file_name[:i]
        file_name_extension_name = file_name[i + 1:]
        
        fname = fn + '.' + (extension_name if extension_name else file_name_extension_name)
    
    print dir + '/' + fname
    
    with open(dir + '/' + fname, 'wb') as f:
        f.write(data)


def make_sure(path):
    is_exists = os.path.exists(path)
    if not is_exists:
        return path
    else:
        return make_sure(path + '_copy')


def mkdir(path):
    # 去除首尾空格
    path = path.strip()
    # 去除尾部 / 符号
    path = path.rstrip("/")
    sure = make_sure(path)
    os.makedirs(sure)
    
    return sure


def image_download_main(url_list, dir_name = ''):
    HOME = os.environ.get('HOME')
    
    if len(dir_name) > 0:
        d_path = mkdir(HOME + '/Desktop/image_download/' + dir_name)
    else:
        d_path = mkdir(HOME + '/Desktop/image_download/' + time.strftime("%Y:%m:%d:%H:%M:%S").replace(':', '_'))
    
    for url in url_list:
        image_download(url, d_path)

    print d_path
    
    subprocess.call("open " + d_path, shell = True)
    
    print("\033[1;44;97m %s \033[0m" % 'The End')


if __name__ == "__main__":
    
    url_list = []
    
    with open('/Users/stone/Desktop/download_url_file/download.txt', 'r') as f:
        while True:
            rl = f.readline()
            if rl:
                r = rl.strip()
                url_list.append(r)
            else:
                break
    
    HOME = os.environ.get('HOME')
    
    d_path = mkdir(HOME + '/Desktop/image_download/' + time.strftime("%Y:%m:%d:%H:%M:%S").replace(':', '_'))
    
    for url in url_list:
        # image_download(url, d_path, get_md5(url) + '.png')
        image_download(url, d_path)
    
    subprocess.call("open " + "\"" + d_path + "\"", shell = True)
    
    print("\033[1;44;97m %s \033[0m" % 'The End')
