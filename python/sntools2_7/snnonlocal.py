#!/usr/bin/evn python
# -*- coding:utf-8 -*-

class Nonlocals(object):
    """ Helper class to implement nonlocal names in Python 2.x """
    
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

