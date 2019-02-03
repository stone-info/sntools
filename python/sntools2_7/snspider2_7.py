#!/usr/bin/evn python
# -*- coding:utf-8 -*-

# from lxml import etree
import urllib
import urllib2
from urllib import (
    urlencode,
    unquote,
)
# import chardet
import cchardet as chardet
import ssl
import cookielib
import lxml

from lxml import html

# ----------------------------------------
# ----------------------------------------
# lxml安装后无法import到etree模块
#  环境：python-3.7+lxml-4.2.5
#    一开始尝试了网上的办法发现都比较麻烦，因为去找老版本的lxml或者换python版本太麻烦了，
#    后来在一篇博客的评论中找到了正确的办法，其实虽然网上说的是python 3.5之后的lxml中不再有etree，
#    但是其实这种说法是有问题的，虽然新版本无法直接from lxml import etree这样，
#    但是它只不过是换了一个办法引出etree模块而已！
#  
# 正确的引用方法是：
#
# from lxml import html
# text=```xxx```//测试的html文本
# etree = html.etree
# htmlDiv = etree.HTML(text)
# title = htmls.xpath("//meta[1]/@content")
# print(title)
#
# 以上这种方式就是新版本lxml中etree中的使用方法，不过使用过程中发现有一些方法无法直接自动匹配提示，对新手入门不是很友好而已。。
# ----------------------------------------
# ----------------------------------------


import requests

# import BeautifulSoup
# from bs4 import BeautifulSoup
# from BeautifulSoup import BeautifulSoup          # For processing HTML
# from BeautifulSoup import BeautifulStoneSoup     # For processing XML
# import BeautifulSoup                             # To get everything

from bs4 import BeautifulSoup
from bs4 import UnicodeDammit
from bs4 import SoupStrainer

import jsonpath

# ------------------------------------------
# selenium相关的
#
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions

from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options as FirefoxOptions

# ------------------------------------------
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
# -------------------------------------------
import unittest

# =====================================
# 压缩数据
# =====================================
import base64
