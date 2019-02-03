#!/usr/bin/evn python
# -*- coding:utf-8 -*-

""" log 打印工具
以模块方式运行的终端命令:
    python3 -m sntools.snlog
"""
import os, sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# import sys, os, re, json, time
# sys.path.append('/Users/stone/Python_Project/001_introductory')
# from sntools.snpack import *

from snpack2_7 import *
import cchardet as chardet
from bs4 import BeautifulSoup

fm = sys._getframe


def mlog(fm_, *items, **kwargs):
    f = 0
    filename = fm_.f_code.co_filename
    info = True
    g = False
    
    if kwargs:
        if kwargs.has_key('c'):
            f = kwargs['c']
        if kwargs.has_key('info'):
            info = kwargs['info']
        if kwargs.has_key('g'):
            g = kwargs['g']
    
    if f == 0:
        a = '1;7;48'  # 黑色
    elif f == 1:
        a = '1;44;97'  # 蓝色
    elif f == 2:
        a = '1;97;42'  # 绿色
    elif f == 3:
        a = '1;0;0'
    else:
        a = '1;7;48'
    
    fmt = ('' if not g else '\033[1;97;42m…\033[0m' * 80 + '\n') + "\033[1;0;0m%s:%d <%s>-:▼\n\033[0m\033[" + a + "m %s " + ("\n\033[0m" + "-" * 80 if not g else '')
    
    # ss = str()
    #
    # for index, item in enumerate(items):
    #
    #     if isinstance(item, unicode):
    #         item = item.encode('utf8')
    #
    #     if index == len(items) - 1:
    #         ss += str(item)
    #     else:
    #         ss += str(item) + ', '
    
    # for index, item in enumerate(items):
    #     if isinstance(item, unicode):
    #         item = item.encode('utf8')
    #     ss += str(item)
    
    ss = str()
    
    if len(items) > 1:
        item0 = items[0]
        item1 = items[1]
        item = item1
        if isinstance(item1, unicode):
            item = item1.encode('utf8') + "【🚨】"
        
        if isinstance(item1, dict):
            item = to_pretty_json(fm(), item1, show = False)
        ss = str(item0) + str(item)
    else:
        item = items[0]
        if isinstance(item, unicode):
            item = item.encode('utf8') + "【🚨】"
        if isinstance(item, dict):
            item = to_pretty_json(fm(), item, show = False)
        
        ss = str(item)
    
    if info:
        print(fmt % (os.path.basename(filename), fm_.f_lineno, time.strftime("%H:%M:%S"), ss))
    else:
        print("\033[" + a + "m %s \033[0m" % (ss))


def get_dir(obj, show = True):
    is_class = False
    try:
        n = obj.__name__
        is_class = True
    except Exception as e:
        is_class = False
    
    if is_class:
        L = [i for i in dir(obj) if not i.startswith('__') and not i.endswith('__')]
        # mlog( fm(), '''L = {}'''.format(L))
        d = {}
        
        for attr_name in L:
            
            attr = getattr(obj, attr_name)
            
            val = str(attr)
            
            d[attr_name] = val
        
        if not d:
            return
        
        if show:
            sl = sorted(d.items(), key = lambda item: len(item[1]))
            # len_ = ''.join(sl[sl.__len__() - 1]).__len__()
            
            lo = sl[len(sl) - 1]
            
            len_ = len(' %-25s : %s ' % (str(lo[0]), str(lo[1])))
            
            print "\033[1;97;42m%s\033[0m" % obj.__name__.center(len_)
            
            # mlog( fm(), obj.__name__.center(len_), info = False, c = 2)
            
            for key, value in sl:
                mlog(fm(), '%-25s : %s' % (str(key), str(value)), info = False)
        else:
            return d
    
    else:
        l = set(i for i in dir(obj) if not i.startswith('__') and not i.endswith('__'))
        L = set(i for i in dir(obj.__class__) if not i.startswith('__') and not i.endswith('__'))
        ll = list(l.union(L))
        
        d = {}
        # mlog( fm(), '''ll = {}'''.format(ll))
        for attr_name in ll:
            
            # mlog(fm(), '''attr_name = {}'''.format(attr_name))
            # mlog(fm(), '''type(attr_name) = {}'''.format(type(attr_name)))
            try:
                attr = getattr(obj, attr_name)
            except Exception as e:
                attr = '未能解析'
            
            val = str(attr.encode('utf8')) if isinstance(attr, unicode) else str(attr)
            
            if hasattr(attr, '__call__'):
                
                if hasattr(obj.__class__, attr_name):
                    search_c = re.search(r'<unbound', str(getattr(obj.__class__, attr_name)))
                else:
                    search_c = "dynamic add"
                search_i = re.search(r'<bound', val)
                
                if not search_c and search_i:
                    d[attr_name] = "类方法   | " + val
                elif search_c and search_i:
                    d[attr_name] = "对象方法 | " + val
                else:
                    d[attr_name] = "静态方法 | " + val
            else:
                d[attr_name] = val
        
        if not d:
            return
        
        if show:
            sl = sorted(d.items(), key = lambda item: len(item[1]))
            # len_ = ''.join(sl[sl.__len__() - 1]).__len__()
            lo = sl[len(sl) - 1]
            len_ = len(' %-25s : %s ' % (str(lo[0]), str(lo[1])))
            
            print "\033[1;97;42m%s\033[0m" % obj.__class__.__name__.center(len_)
            
            # mlog( fm(), obj.__class__.__name__.center(len_), info = False, c = 2)
            for key, value in sl:
                mlog(fm(), '%-25s : %s' % (str(key), (str(value) if value else '空')), info = False)
        else:
            return d


def description(instance):
    class_dir = [i for i in dir(instance.__class__) if not i.startswith('__') and not i.endswith('__')]
    instance_dir = [i for i in dir(instance) if not i.startswith('__') and not i.endswith('__')]
    class_dir.sort(key = lambda item: item.__len__())
    instance_dir.sort(key = lambda item: item.__len__())
    u = sorted(list(set(class_dir).union(set(instance_dir))), key = lambda item: item.__len__())
    d = {}
    try:
        if not instance.__dict__:
            raise Exception('dict empty')
        else:
            properties_instance = list(instance.__dict__)
    except Exception as e:
        properties_instance = list(instance.__slots__)
    for attr_name in u:
        
        if hasattr(getattr(instance, attr_name), '__call__'):
            continue
        
        k = None
        v = None
        
        if hasattr(instance, attr_name) and hasattr(instance.__class__, attr_name):
            # 对象中有 , 类中也有
            if isinstance(getattr(instance.__class__, attr_name), property):
                k = None
                v = None
            else:
                
                if attr_name in properties_instance:
                    k = attr_name
                    v = getattr(instance, attr_name)
                else:
                    
                    search = re.search(r'_.+(__.+)', attr_name, re.I)
                    if search:
                        # att = search.group(1)
                        k = attr_name
                        v = ('指向自己(单例模式)' if id(getattr(instance, attr_name)) == id(instance) else getattr(instance, attr_name))
                    else:
                        k = attr_name + '(类变量)'
                        v = ('指向自己(单例模式)' if id(getattr(instance, attr_name)) == id(instance) else getattr(instance, attr_name))
        
        elif hasattr(instance, attr_name) and not hasattr(instance.__class__, attr_name):
            # 对象中有 , 类中没有
            # mlog( fm(), attr_name, c = 1)
            k = attr_name
            v = getattr(instance, attr_name)
        
        elif not hasattr(instance, attr_name) and hasattr(instance.__class__, attr_name):
            # 对象没有 , 类中有
            # mlog( fm(), attr_name, c = 2)
            pass
        
        if k is not None and v is not None:
            
            d[k] = __validate(v)
    
    return '{} | <{}> | {}'.format(instance.__class__.__name__, hex(id(instance)), json.dumps(d, indent = 2, ensure_ascii = False))


def get_keyworld_list():
    return keyword.kwlist


def get_python_version():
    return '''{}.{}.{}'''.format(sys.version_info.major, sys.version_info.minor, sys.version_info.micro)


def is_python3():
    # raise RuntimeError('At least Python 3.4 is required')
    return sys.version_info >= (3, 0)


def is_python2():
    return sys.version_info < (3, 0)


# def to_s(obj):
#     return json.dumps(obj, indent = 2, ensure_ascii = False)

def to_s(obj):
    markup = obj
    soup = BeautifulSoup(markup, 'lxml')
    return soup.get_text().encode('utf8')
    
    # ----------------------------------------
    # print("━"*46)
    # ----------------------------------------
    # 编码自动检测; 功能可以在Beautiful; Soup以外使用, 检测某段未知编码时, 可以使用这个方法:
    # from bs4 import UnicodeDammit
    # dammit = UnicodeDammit("Sacr\xc3\xa9 bleu!")
    # print(dammit.unicode_markup)
    # # Sacré bleu!
    # dammit.original_encoding
    # 'utf-8'
    # ----------------------------------------
    # print("━"*46)
    # ----------------------------------------
    
    # mlog(fm(), '''type(soup.get_text()) = {}'''.format(type(soup.get_text())))
    # print soup.get_text().encode('utf8')
    # mlog(fm(), '''soup.get_text().encode('utf8') = {}'''.format(soup.get_text().encode('utf8')))
    #
    # return json.dumps(obj, indent = 2, ensure_ascii = False)


def to_utf8(obj):
    code = obj
    
    if isinstance(obj, unicode):
        # u'中国'
        code = obj.encode('utf8') + "【🚨】"
        return code
    elif isinstance(obj, str):
        
        check = chardet.detect(obj)['encoding']
        
        mlog(fm(), '''check = ''', check)
        
        if check in ['utf-8', 'Windows-1254']:
            code = code.decode('utf8')
            return code.encode('utf8')
        
        if check == 'ascii':
            code = code.decode('ascii')
            return code.encode('utf8')
        
        if check.lower() in ['gbk', 'gb2312']:
            code = code.decode('gbk')
            return code.encode('utf8')
        
        return code
    
    return code


# def to_utf8(obj):
#
#     code = None
#
#     if isinstance(obj, unicode):
#         # u'中国'
#         code = obj.encode('utf8')
#
#         return code
#
#     elif isinstance(obj, str):
#         # '\u4e2d\u56fd'
#         # r'\u4e2d\u56fd'
#         # "��������"
#
#         # if re.search(r'\\u....', obj):
#         #     mlog(fm(), '进这里了???')
#         #     code = obj.decode('unicode_escape')
#         #     return code.encode('utf8')
#
#         check = chardet.detect(obj)['encoding']
#
#         if check in ['utf-8', 'Windows-1254']:
#             # code = obj.decode('utf8')
#             # return code.encode('utf8')
#             return obj
#
#         if check == 'ascii':
#             code = obj.decode('ascii')
#             return code.encode('utf8')
#         # Windows-1254
#         if check.lower() in ['gbk', 'gb2312']:
#             code = obj.decode('gbk')
#             return code.encode('utf8')
#
#         code = obj.decode(check)
#         return code.encode('utf8')
#         #
#         # if e:
#         #     code = obj.decode(e)
#         #     return code.encode('utf8')
#         # try:
#         #     code = obj.decode('utf8')
#         #     return code.encode('utf8')
#         # except Exception as e:
#         #     try:
#         #         code = obj.decode('unicode_escape')
#         #         return code.encode('utf8')
#         #     except Exception as e:
#         #         try:
#         #             code = obj.decode('gbk')
#         #             return code.encode('utf8')
#         #         except Exception as e:
#         #             return obj
#     else:
#         return obj


def ref_count(obj):
    mlog(fm(), str(obj) + " \\\n ref_count = " + str(sys.getrefcount(obj)), info = False, c = 1)


## 调用方法的时候 搜索的顺序, 如果找到了, 停止往下查找
def get_mro(obj, show = True):
    if show:
        mlog(fm(), '''obj.__class__.__mro__ = {}'''.format(get_class(obj).__mro__))
    else:
        return get_class(obj).__mro__


def get_class(obj):
    try:
        n = obj.__name__
        return obj
    except Exception as e:
        return obj.__class__


def __validate(value):
    v = None
    
    if isinstance(value, (str, int, float, dict, list, set, tuple)):
        v = value
    elif isinstance(value, unicode):
        v = value.encode('utf-8')
    else:
        v = str(value)
    
    return v


def __handle_list(l):
    new_l = []
    for item in l:
        if isinstance(item, (str, int, float, dict, list, set, tuple)):
            if isinstance(item, (str, int, float)):
                new_l.append(item)
            else:
                if isinstance(item, (list, set, tuple)):
                    hl = __handle_list(item)
                    new_l.append(hl)
                if isinstance(item, dict):
                    hd = __handle_dict(item)
                    new_l.append(hd)
        else:
            s = 'Error Error'
            if isinstance(item, unicode):
                s = str(item.encode('utf8'))
            else:
                s = str(item)
            new_l.append(s)
    return new_l


def __handle_dict(d):
    new_d = {}
    
    for key, item in d.items():
        if isinstance(item, (str, int, float, dict, list, set, tuple)):
            
            if isinstance(item, (str, int, float)):
                new_d[key] = item
            else:
                if isinstance(item, (list, set, tuple)):
                    hl = __handle_list(item)
                    new_d[key] = hl
                if isinstance(item, dict):
                    hd = __handle_dict(item)
                    new_d[key] = hd
        else:
            if isinstance(item, unicode):
                new_d[key] = str(item.encode('utf8'))
            else:
                new_d[key] = str(item)
    
    return new_d


def to_pretty_json(fm, obj, show = True, info = True, c = 0, g = False):
    handle_r = None
    
    if isinstance(obj, list):
        handle_r = __handle_list(obj)
    elif isinstance(obj, dict):
        handle_r = __handle_dict(obj)
    
    s = json.dumps(handle_r, indent = 2, ensure_ascii = True)
    
    r = re.sub(r"\\u[0-9A-F]{4}", lambda item: item.group(0).decode('unicode_escape').encode('utf8'), s, count = 0, flags = re.IGNORECASE | re.MULTILINE)
    
    if show:
        mlog(fm, r, info = info, c = c, g = g)
    return r


def get_pretty_json(iterable_obj, show = True, json_mode = False, **kwargs):
    r = None
    
    if isinstance(iterable_obj, list):
        r = []
        for item in iterable_obj:
            r.append(__validate(item))
    if isinstance(iterable_obj, tuple):
        r = []
        for item in iterable_obj:
            r.append(__validate(item))
        r = tuple(r)
    
    if isinstance(iterable_obj, dict):
        r = {}
        for key, value in iterable_obj.items():
            r[key] = __validate(value)
    
    if show:
        if kwargs:
            if json_mode:
                mlog(kwargs['fm'], json.dumps(r, indent = 2, ensure_ascii = False))
            else:
                if isinstance(r, dict):
                    for key, value in sorted(r.items(), key = lambda item: len(str(item[1]))):
                        mlog(fm(), '%-25s : %s' % (str(key), str(value)), info = False)
                else:
                    mlog(kwargs['fm'], json.dumps(r, indent = 2, ensure_ascii = False))
        else:
            if json_mode:
                mlog(fm(), json.dumps(r, indent = 2, ensure_ascii = False))
            else:
                if isinstance(r, dict):
                    for key, value in sorted(r.items(), key = lambda item: len(str(item[1]))):
                        mlog(fm(), '%-25s : %s' % (str(key), str(value)), info = False)
                else:
                    mlog(fm(), json.dumps(r, indent = 2, ensure_ascii = False))
    else:
        return r


def get_uuid():
    """
    print uuid.uuid1()
    bf1dfacf-67d8-11e8-9a23-408d5c985711
    
    print uuid.uuid3(uuid.NAMESPACE_DNS, 'yuanlin')
    ddb366f5-d4bc-3a20-ac68-e13c0560058f
    
    print uuid.uuid4()
    144d622b-e83a-40ea-8ca1-66af8a86261c
    
    print uuid.uuid5(uuid.NAMESPACE_DNS, 'yuanlin')
    4a47c18d-037a-5df6-9e12-20b643c334d3
    
    uuid1()：这个是根据当前的时间戳和MAC地址生成的，最后的12个字符408d5c985711对应的就是MAC地址，
    因为是MAC地址，那么唯一性应该不用说了。但是生成后暴露了MAC地址这就很不好了。

    uuid3()：里面的namespace和具体的字符串都是我们指定的，然后呢···应该是通过MD5生成的，这个我们也很少用到，莫名其妙的感觉。

    uuid4()：这是基于随机数的uuid，既然是随机就有可能真的遇到相同的，但这就像中奖似的，几率超小，因为是随机而且使用还方便，所以使用这个的还是比较多的。

    uuid5()：这个看起来和uuid3()貌似并没有什么不同，写法一样，也是由用户来指定namespace和字符串，不过这里用的散列并不是MD5，而是SHA1.
    """
    return uuid.uuid4().hex.upper()


def get_md5(obj):
    m1 = hashlib.md5()
    m1.update(str(obj))
    return m1.hexdigest()


# 获取环境变量
def get_environ_value(obj):
    return os.environ.get(obj)
    # get = os.environ.get('JAVA_HOME')
    # mlog(fm(), '''get = {}'''.format(get))


if __name__ == "__main__":
    
    class Person(object):
        country = 'China'
        
        __slots__ = ('__name', '__age', '_city')
        
        def __init__(self, name, age):
            self.__name = name
            self.__age = age
            self._city = 'Beijing'
        
        @property
        def name(self):
            return self.__name
        
        @name.setter
        def name(self, name):
            self.__name = name
        
        @property
        def age(self):
            return self.__age
        
        @age.setter
        def age(self, age):
            self.__age = age
        
        def __str__(self):
            return description(self)
        
        def __del__(self):
            fmt = "snlog2_7.py:194 :▼\n\033[1;97;41m %s \033[0m"
            print(fmt % ("■■■■■■ %s(%s) is dead ☠☠☠ ■■■■■■" % (self.__class__.__name__, hex(id(self)))))
    
    
    person = Person('stone', 29)
    
    mlog(fm(), '''person = {}'''.format(person))
    
    # name = get_file_name('https://imgsa.baidu.com/forum/w%3D580/sign=c78a7b3dcb5c1038247ececa8210931c/46df8db1cb13495427f993435b4e9258d1094a35.jpg')
    # mlog(fm(), '''name = {}'''.format(name))
    
    print("\033[1;44;97m %s \033[0m" % 'The End')

# if sys.version_info >= (3,):
#         def acquire(self, blocking: bool = ..., timeout: float = ...) -> bool: ...
#     else:
#         def acquire(self, blocking: bool = ...) -> bool: ...
