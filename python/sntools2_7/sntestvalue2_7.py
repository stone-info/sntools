#!/usr/bin/evn python
# -*- coding:utf-8 -*-

from snpack2_7 import *


def get_number_list(len = 10):
    arr = []
    for i in range(0, len, 1):
        arr.append(random.randint(0, 200))
    return arr



