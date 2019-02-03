#!/usr/bin/evn python
# -*- coding:utf-8 -*-

from snpack2_7 import *
from pylimit2_7 import *
from snregex2_7 import *
from snset2_7 import *
from sncommands2_7 import *
from sntestvalue2_7 import *
from snlog2_7 import *
from snnonlocal import *
from snspider2_7 import *
from sndownload import *


# 单个下划线 当前模块中能使用, 禁止导入到别处(就是 from xxx import * 这种方式导入时用不了)
# 但是 import xxx , xxx._foo 这么调用可以使用...
# 例如 sys._getframe

# def _foo(*args, **kw):
#     print 'hello world'

def get_help(obj):
    # noinspection PyUnresolvedReferences
    help(obj)

# import sys
# reload(sys)
# sys.setdefaultencoding('utf8')

from datetime import date
