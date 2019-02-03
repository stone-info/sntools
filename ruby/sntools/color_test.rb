#!/usr/bin/ruby
# -*- coding: UTF-8 -*-

# puts("━" * 46)

(1...2).each do |i|
  100.times do |j|
    100.times do |k|
      # puts "#{i}:#{j}:#{k}\033[#{i};#{j};#{k}m %s \033[0m" % ["━" * 46]
      print "#{i}:#{j}:#{k}\033[#{i};#{j};#{k}m\n\033[0m"
    end
  end
end

