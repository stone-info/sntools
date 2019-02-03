#!/usr/bin/ruby
# -*- coding: UTF-8 -*-

require 'fileutils'
require 'date'
require 'set'
require 'pp'

class String
  def log
    # mlog(%q|self.inspect = | + "#{self.inspect}")
    caller_infos = caller.first.split(":")
    begin
      fmt = "%s:%d <%s>-:▼\n\033[1;7;48m %s \033[0m\n" + "-" * 80
      puts fmt % [caller_infos[0].split("/")[-1].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), self.inspect]
    rescue => err
      puts("\033[1;97;41m error: %s \033[0m" % err)
    ensure
      # puts"Ensuring execution"
    end
  end
  
  def +(other)
    "#{self}#{other}"
  end
end

def get_color(color)
  case color
    when 0
      a = '1;7;48'
    when 1
      a = '1;44;97'
    when 2
      a = '1;97;42'
    when 3
      a = '1;97;41'
    when 4
      a = '1;0;0'
    else
      a = '1;7;48'
  end
  a
end

# def mlog (o, color = 0, inline = false, info = true)
def mlog_json(o)
  a            = '1;7;48'
  fmt          = "\033[1;34;4m%s:%d <%s>-:▼ %s\n\033[0m"
  caller_infos = caller.first.split(":")
  print fmt % [caller_infos[0].split("/")[-1].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), caller_infos[0].to_s]
  pp o
end

def fgx
  print "\033[1;7;92m\n\033[0m"
  print "\033[1;7;94m\n\033[0m"
  print "\033[1;7;92m\n\033[0m"
end

def mlog (o, c: 0, info: true, inline: false)
  a     = get_color(c)
  color = "\033[#{a}m %s \n\033[0m"
  
  b = "\033[1;34;4m%s:%d <%s>-:▼\033[0m【%s】\n"
  
  fmt = b + color + "-" * 80
  
  caller_infos = caller.first.split(":")
  
  if inline
    if o.to_s.include?("\n")
      print "\033[#{a}m %s \033[0m" % [o.to_s]
    else
      print "\033[#{a}m %s \n\033[0m" % [o.to_s]
    end
  else
    if info
      puts fmt % [caller_infos[0].split("/")[-1].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), caller_infos[1], o.to_s]
      # puts fmt % [caller_infos[0].split("/")[-1].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), o.to_s]
      # puts fmt % [caller_infos[0].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), o.to_s]
    else
      if o.to_s.include?("\n")
        print "\033[#{a}m %s \033[0m" % [o.to_s]
      else
        print "\033[#{a}m %s \n\033[0m" % [o.to_s]
      end
    end
  end
end

def mlog_func(class_, method_, c: 0)
  
  f = "#{class_}".include?('#<')
  
  # class_name = "#{class_}" if f
  # class_name = "#{class_.class}" unless f
  
  if f
    class_name = "#{class_.class}"
  else
    class_name = "#{class_}"
  end
  
  o = class_name + " | " + (f ? 'instance' : 'class') + %q| method = | + "#{method_}"
  
  a = get_color(c)
  
  color = "\033[#{a}m %s \033[0m"
  
  fmt = "%s:%d <%s>-:▼\n" + color + "\n" + "-" * 80
  
  caller_infos = caller.first.split(":")
  puts fmt % [caller_infos[0].split("/")[-1].to_s, caller_infos[1], Time.new.strftime("%H:%M:%S"), o.to_s]

end

def get_uuid
  aa     = ("a".."z").to_a + ("A".."Z").to_a + ("0".."9").to_a
  number = ""
  32.times do
    number << aa.sample
  end
  number
end

def get_number_array(length = 10)
  number_arr = []
  length.times do
    number_arr << rand(0..1000)
  end
  number_arr
end