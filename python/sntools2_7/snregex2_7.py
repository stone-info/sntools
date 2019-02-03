#!/usr/bin/evn python
# -*- coding:utf-8 -*-

"""
模式匹配
https://blog.csdn.net/smilelance/article/details/6529950

re.U 表示特殊字符集 \w, \W, \b, \B, \d, \D, \s, \S 依赖于 Unicode 字符属性数据库

re.A
re.ASCII

re.DEBUG

re.I
re.IGNORECASE 忽略大小写


re.L
re.LOCALE 表示特殊字符集 \w, \W, \b, \B, \s, \S 依赖于当前环境
字符集本地化。这个功能是为了支持多语言版本的字符集使用环境的，比如在转义符/w，在英文环境下，它代表[a-zA-Z0-9]，即所以英文字符和数字。
如果在一个法语环境下使用，缺省设置下，不能匹配"é" 或 "ç"。
加上这L选项和就可以匹配了。不过这个对于中文环境似乎没有什么用，它仍然不能匹配中文字符。


re.M
re.MULTILINE 多行模式
多行匹配。在这个模式下’^’(代表字符串开头)和’$’(代表字符串结尾)将能够匹配多行的情况，成为行首和行尾标记。

re.X
re.VERBOSE 为了增加可读性，忽略空格和 # 后面的注释
这个选项忽略规则表达式中的空白，并允许使用’#’来引导一个注释。这样可以让你把规则写得更美观些。比如你可以把规则
比如: rc = re.compile(r"/d+|[a-zA-Z]+")       #匹配一个数字或者单词
使用X选项写成:
"rc = re.compile(r\"\"\"    # start a rule
/d+                         # number
| [a-zA-Z]+                 # word
\"\"\", re.VERBOSE)"
"在这个模式下，如果你想匹配一个空格，你必须用'/ '的形式（'/'后面跟一个空格） "



re.S
re.DOTALL 即为 . 并且包括换行符在内的任意字符（. 不包括换行符）
使“.”特殊字符完全匹配任何字符，包括换行符；如果没有此标志，“.”将匹配除换行符以外的任何内容。对应于内联标志(？s)。
‘.’号将匹配所有的字符。缺省情况下’.’匹配除换行符’/n’外的所有字符，使用这一选项以后，’.’就能匹配包括’/n’的任何字符了。

"""

from sntools2_7.snlog2_7 import (
    mlog,
    fm,
)
import re


def startswith(pattern, test_str, flags = re.IGNORECASE | re.MULTILINE):
    return bool(re.match(pattern, test_str, flags))


def contains(pattern, test_str, flags = re.IGNORECASE | re.MULTILINE):
    return bool(re.search(pattern, test_str, flags))


def replace_match(pattern, repl_or_function, test_str, count = 0, flags = re.IGNORECASE | re.MULTILINE):
    # 0表示 找到几个 替换几个
    sub = re.sub(pattern, repl_or_function, test_str, 0, flags)
    return sub


def split(pattern, test_str, maxsplit = 0, flags = re.IGNORECASE | re.MULTILINE):
    r = re.split(pattern, test_str, maxsplit = maxsplit, flags = flags)
    return r


def get_all_match(regex, test_str, flag = re.IGNORECASE | re.MULTILINE):
    # regex = r"a[^cf]c"
    # test_str = 'abc, acc, adc , aec, afc, ahc'
    re_findall = re.findall(regex, test_str, flag)
    return re_findall


def get_all_match_detail(regex, test_str, flag = re.IGNORECASE | re.MULTILINE):
    # regex = r", (\d+), (\d+)"
    # test_str = "hello world, hello stone, 123, abc, 567, 789, 5678, 111111, 09090909"
    
    matches = re.finditer(regex, test_str, flag)
    
    out_list = []
    
    for match_num, match in enumerate(matches):
        
        out_dict = {}
        
        match_num = match_num + 1
        
        # 匹配上的
        out_dict['range'] = (match.start(), match.end())
        out_dict['find'] = match.group()
        out_dict['groups'] = []
        
        inside_list = []
        for group_num in range(0, len(match.groups())):
            
            # 小括号 获取的 即, $1 $2 等
            group_num = group_num + 1
            group_span = (match.start(group_num), match.end(group_num))
            inside_group = match.group(group_num)
            
            inside_list.append({
                'range': group_span,
                'find' : inside_group
            })
        
        out_dict['groups'] = inside_list
        
        out_list.append(out_dict)
    
    return out_list


if __name__ == "__main__":
    
    print("\033[1;44;97m %s \033[0m" % 'The End')
