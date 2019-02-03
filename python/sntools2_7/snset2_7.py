#!/usr/bin/evn python
# coding:utf-8


from snlog2_7 import (
    mlog,
    fm,
)
from pylimit2_7 import *


@type_limit(set, set)
def difference(source_set, other_set):
    """
    找到source_set中存在，other_set中不存在的集合，返回新值
    """
    return source_set.difference(other_set)


@type_limit(set, set)
def intersection(source_set, other_set):
    """
    取交集，赋给新值
    """
    return source_set.intersection(other_set)


@type_limit(set, set)
def symmetric_difference(source_set, other_set):
    """
    合并不同项，并赋新值, 相同项被排除
    """
    return source_set.symmetric_difference(other_set)


@type_limit(set, set)
def union(source_set, other_set):
    """
    取并集，并赋新值
    """
    return source_set.union(other_set)


if __name__ == "__main__":
    
    se = {11, 22, 33}
    be = {22, 55}
    
    mlog( fm(), '''difference(se,be) = {}'''.format(difference(se, be)))
    mlog( fm(), '''intersection(se,be) = {}'''.format(intersection(se, be)))
    mlog( fm(), '''symmetric_difference(se,be) = {}'''.format(symmetric_difference(se, be)))
    mlog( fm(), '''union(se,be) = {}'''.format(union(se, be)))
    
    a = {11, 22, 33, 44}
    b = {33, 44, 55, 66}
    
    # ----------------------------------------
    print("━" * 46)
    # ----------------------------------------
    
    mlog( fm(), '''a = {}'''.format(a))
    mlog( fm(), '''b = {}'''.format(b))
    mlog( fm(), '''a & b = {}'''.format(a & b), c = 1)
    mlog( fm(), '''a | b = {}'''.format(a | b), c = 1)
    mlog( fm(), '''a ^ b = {}'''.format(a ^ b), c = 1)
    
    mlog( fm(), '''a - b = {}'''.format(a - b), c = 1)
    mlog( fm(), '''b - a = {}'''.format(b - a), c = 1)
