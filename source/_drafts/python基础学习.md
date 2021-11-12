---
title: python基础学习
comment: true
date: 2021-03-25 23:12:52
tags:
categories:
addrlink:
---

# Python基础

python没有花括号`{}`，靠缩进来代替花括号，每一行都是一个语句，当语句以冒号`:`结尾时，缩进的语句视为`代码块`

Python程序是大小写敏感的，如果写错了大小写，程序会报错。

以`#`开头的语句是注释

## 数据类型和变量

### 数据类型

在Python中，能够直接处理的数据类型有：整数、浮点数、字符串、布尔值、空值、列表、元组、字典、集合

####  整数

Python可以处理任意大小的整数

用十六进制表示整数方法：用`0x`前缀和0-9，a-f表示，例如：`0xff00`，`0xa5b4c3d2`

对于很大的数，例如`10000000000`，Python允许在数字中间以`_`分隔，因此，写成`10_000_000_000`和`10000000000`是完全一样的。十六进制数也可以写成`0xa1b2_c3d4`

其常见运算符有：`+`、`-`、`*`、`/`、`//`、`%`、`=`等

- `/`：表示除法运算，计算结果是浮点数，即使是两个整数恰好整除，结果也是浮点数
- `//`：称为地板除，两个整数的除法仍然是整数，即使除不尽，只取结果的整数部分
- `%`：求余数运算



#### 浮点数

常见浮点数：3.14

Python可以处理任意大小的浮点数

对于很大或很小的浮点数，就必须用科学计数法表示，把10用e替代，1.23x109就是`1.23e9`，0.000012可以写成`1.2e-5`



浮点数也可用整数的运算符

- `//`：地板除，结果不是整数，但依然是地板除



#### 字符串

字符串是以单引号`'`或双引号`"`括起来的任意文本，如果`'`本身也是一个字符，那就可以用`""`括起来，比如`"I'm OK"`

如果字符串内部既包含`'`又包含`"`，可以用转义字符`\`来标识，如：`'I\'m \"OK\"!'`表示`I'm "OK"!`

当输出转义字符`\`时，可用`\\`

例子：

```python
>>> print('I\'m ok.')
I'm ok.
>>> print('I\'m learning\nPython.')
I'm learning
Python.
>>> print('\\\n\\')
\
\
```

如果字符串内部有很多换行，可用`'''...'''`的格式表示多行内容

例子：

```python
>>> print('''
    hello world
... hello
 world
hi
''')
    hello world
... hello
 world
hi
```



字符串的格式化：与C语言类似，采用占位符的方式，常见占位符：

| 占位符 | 替换内容     |
| ------ | ------------ |
| %d     | 整数         |
| %f     | 浮点数       |
| %s     | 字符串       |
| %x     | 十六进制整数 |

例子：

```python
num1=1
num2=3
print('num1: %d / num2: %d = result: %f' %(num1,num2,num1/num2))
>>> num1: 1 / num2: 3 = result: 0.333333
```

如果不太确定应该用什么，`%s`永远起作用，它会把任何数据类型转换为字符串：

```python
>>> 'Age: %s. Gender: %s' % (25, True)
'Age: 25. Gender: True'
```

若想输出`%`，则需要转义，用`%%`来表示一个`%`



常用函数：

| 函数             | 作用                                       | 用法                   |
| ---------------- | ------------------------------------------ | ---------------------- |
| len()            | 获取字符串长度                             | len('hello world')     |
| replace('a','A') | 将字符串中的a替换为A，并返回替换后的字符串 | ’abc'.replace('a','A') |
|                  |                                            |                        |
|                  |                                            |                        |





#### 布尔值

即`True`和`False`，注意大小写



#### 空值

空值用`None`表示



#### 列表

列表list是一种有序的集合，可以随时添加和删除其中的元素

例子：

```python
>>> classmates = ['Michael', 'Bob', 'Tracy']
>>> classmates
['Michael', 'Bob', 'Tracy']
>>> len(classmates)
3
```

用索引来访问list中每一个位置的元素，索引从`0`开始：

```python
>>> classmates[0]
'Michael'
>>> classmates[1]
'Bob'
>>> classmates[2]
'Tracy'
>>> classmates[3]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
IndexError: list index out of range
```

如果要取最后一个元素，除了计算索引位置外，还可以用`-1`做索引，直接获取最后一个元素：

```python
>>> classmates[-1]
'Tracy'
```

以此类推，可以获取倒数第2个、倒数第3个：

```python
>>> classmates[-2]
'Bob'
>>> classmates[-3]
'Michael'
>>> classmates[-4]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
IndexError: list index out of range
```

list是一个可变的有序表，可以往list中追加元素到末尾：

```python
>>> classmates.append('Adam')
>>> classmates
['Michael', 'Bob', 'Tracy', 'Adam']
```

把元素插入到指定的位置：

```python
>>> classmates.insert(1, 'Jack')
>>> classmates
['Michael', 'Jack', 'Bob', 'Tracy', 'Adam']
```

弹出并删除list末尾的元素：

```python
>>> classmates.pop()
'Adam'
>>> classmates
['Michael', 'Jack', 'Bob', 'Tracy']
```

删除指定位置的元素：

```python
>>> classmates.pop(1)
'Jack'
>>> classmates
['Michael', 'Bob', 'Tracy']
```

把某个元素替换成别的元素：

```python
>>> classmates[1] = 'Sarah'
>>> classmates
['Michael', 'Sarah', 'Tracy']
```

list里面的元素的数据类型也可以不同：

```python
>>> L = ['Apple', 123, True]
```

list元素也可以是另一个list：

```python
>>> s = ['python', 'java', ['asp', 'php'], 'scheme']
>>> len(s)
4
```



常用函数：

| 函数        | 作用                     | 用法                         |
| ----------- | ------------------------ | ---------------------------- |
| len()       | 获取list元素个数         | len(classmates)              |
| append()    | 往list中追加元素到末尾   | classmates.append('Adam')    |
| insert()    | 把元素插入到指定的位置   | classmates.insert(1, 'Jack') |
| pop()       | 弹出并删除list末尾的元素 | classmates.pop()             |
| pop(i)      | 弹出并删除指定位置的元素 | classmates.pop(1)            |
| A.extend(B) | 将B的全部元素append到A   | A.extend(B)                  |



#### 元组

元组tuple也是一种有序列表

但是tuple一旦初始化就不能修改，它没有append()，insert()这样的方法

其获取元素的方法和list是一样的，可以使用`classmates[0]`，`classmates[-1]`，但不能赋值成另外的元素。

注意：当定义一个tuple时，在定义的时候，tuple的元素就必须被确定下来

例子：

```python
>>> classmates = ('Michael', 'Bob', 'Tracy')
```



当定义一个只有1个元素的tuple时，若这么定义：

```python
>>> t = (1)
>>> t
1
```

这时，定义的不是tuple，是`1`这个数！这是因为括号`()`既可以表示tuple，又可以表示数学公式中的小括号，这就产生了歧义，因此，Python规定，这种情况下，按小括号进行计算，计算结果自然是`1`。

所以，只有1个元素的tuple定义时必须加一个逗号`,`，来消除歧义：

```python
>>> t = (1,)
>>> t
(1,)
```



注意：元组是放在括号中，列表是放于方括号中



#### 字典

字典dict（dictionary），在其他语言中也称为map，使用键-值（key-value）存储

如：

```python
>>> d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
>>> d['Michael']
95
```



常用函数：

| 函数     | 作用                                 | 用法         |
| -------- | ------------------------------------ | ------------ |
| pop(key) | 弹出并删除                           | d.pop('Bob') |
| get(key) | 获取key对应的value，没有的话返回None | d.get('Bob') |
|          |                                      |              |



#### 集合

集合set是一组数据的集合，且数据不可重复

还有，set中的元素是无序的

如：

```python
>>> s = set([1, 2, 3, 3, 3])   # 将list中的元素存入set，重复元素在set中自动被过滤
>>> s
{1, 2, 3}
```

set还可做数学意义上的交集、并集等操作：

```python
>>> s1 = set([1, 2, 3])
>>> s2 = set([2, 3, 4])
>>> s1 & s2
{2, 3}
>>> s1 | s2
{1, 2, 3, 4}
```





常用函数：

| 函数        | 作用    | 用法        |
| ----------- | ------- | ----------- |
| add(key)    | 添加key | s.add(4)    |
| remove(key) | 删除key | s.remove(4) |
|             |         |             |





### 变量

变量名必须是大小写英文、数字和`_`的组合，且不能用数字开头

在Python中，等号`=`是赋值语句，可以把任意数据类型赋值给变量

同一个变量可以反复赋值，而且可以是不同类型的变量

> 这种变量本身类型不固定的语言称之为*动态语言*，与之对应的是*静态语言*。静态语言在定义变量时必须指定变量类型，如果赋值的时候类型不匹配，就会报错。比如Java就是典型的静态语言



**`_`对变量的默认用法：**

- 前带`_`的变量：标明这是个私有变量，如`_private_value`
- 前带两个`_`，后带两个`_`的变量：标明这是个内置变量，如`__class__`
- 大写加下划线的变量：标明这是个不会改变的全局变量，如`USER_CONSTANT`

当然这都只是标明，要访问还是可以访问到的，要改变也是可以改变到的。



### 常量

在Python中，通常用全部大写的变量名表示常量，如：

```python
PI = 3.14159265359
```

但事实上`PI`仍然是一个变量，Python根本没有任何机制保证`PI`不会被改变



## 条件判断

注意，python靠缩进来判断代码块

还有，不要少写了冒号`:`

**if语句：**

```python
age = 20
if age >= 18:
    print('your age is', age)
    print('adult')

your age is 20
adult
```

**if…else…语句：**

```python
age = 3
if age >= 18:
    print('your age is', age)
    print('adult')
else:
    print('your age is', age)
    print('teenager')
```

**if…elif…else…语句：**

```python
age = 3
if age >= 18:
    print('adult')
elif age >= 6:
    print('teenager')
else:
    print('kid')
```

`elif`是`else if`的缩写，可以有多个`elif`



## 循环

Python的循环有两种：

- for...in循环，依次把list或tuple中的每个元素迭代出来
- while循环，只要条件满足，就不断循环，条件不满足时退出循环



### for…in循环

直接看例子：

```python
names = ['Michael', 'Bob', 'Tracy']
for name in names:
    print(name)

# 输出
Michael
Bob
Tracy
```

```python
# 1到100的相加
res=0
for i in range(101):
    res=res+i
print(res)
```



### while循环

```python
sum = 0
n = 99
while n > 0:
    sum = sum + n
    n = n - 2
print(sum)
```



### break

在循环过程中，可以通过`break`提前退出循环

```python
n = 1
while n <= 100:
    if n > 10: # 当n = 11时，条件满足，执行break语句
        break # break语句会结束当前循环
    print(n)
    n = n + 1
print('END')
```



### continue

在循环过程中，可以通过`continue`，跳过当前的这次循环，直接开始下一次循环

```python
n = 0
while n < 10:
    n = n + 1
    if n % 2 == 0: # 如果n是偶数，执行continue语句
        continue # continue语句会直接继续下一轮循环，后续的print()语句不会执行
    print(n)

# 输出
1，3，5，7，9
```











# 函数

Python解释器中内置了很多函数，具体可看[Built-in Functions](https://docs.python.org/3/library/functions.html)



**`_`对函数的默认用法：**

- 前带一个`_`的函数，标明是个私有函数
- 前带两个`_`，后带两个`_`函数：标明是个特殊函数



## 常用内置函数

[python3内置函数](https://docs.python.org/zh-cn/3/library/functions.html#abs)

### input()

读取用户的输入

其返回的数据类型是字符串

```python
num=input()   # 没提示
num=input('input a number: ')   # 有提示，input a number: 
```



### int()

将数字字符串转换为整数类型

```python
num1=input('input num1: ')
num2=input('input num2: ')
num1=int(num1)
num2=int(num2)
print('num1+num2=',num1+num2)
```

如果`int(abc)`，会报如下错误：

```python
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: invalid literal for int() with base 10: 'abc'
```

类似的数据类型转换函数还有：

```python
int('123')
float('12.34')
str(1.23)
bool(1)  # True
bool('')  # Flase
```





### range()

该函数一般用来生成一段左闭右开的整数范围

其返回的是一个可迭代对象（类型是对象），而不是列表类型，因此常用`list()`把它转换为列表类型

用法：

```python
range(stop)
range(start, stop[, step])  # [] 表示可选
```

- start: 计数从 start 开始。默认是从 0 开始。例如range（5）等价于range（0， 5）;
- stop: 计数到 stop 结束，但不包括 stop。例如：range（0， 5） 是[0, 1, 2, 3, 4]没有5
- step：步长，默认为1。例如：range（0， 5） 等价于 range(0, 5, 1)

例子：

```python
>>>range(5)
range(0, 5)
>>> for i in range(5):
...     print(i)
... 
0
1
2
3
4
>>> list(range(5))
[0, 1, 2, 3, 4]
>>> list(range(0))
[]
>>>
```



### list()

该方法用于将元组或字符串转换为列表

返回值：列表

用法：

```python
list( seq )  # seq 为要转换为列表的元组或字符串。
```

例子：

```python
aTuple = (123, 'Google', 'Runoob', 'Taobao')
list1 = list(aTuple)
print ("列表元素 : ", list1)

str="Hello World"
list2=list(str)
print ("列表元素 : ", list2)

# 输出：
列表元素 :  [123, 'Google', 'Runoob', 'Taobao']
列表元素 :  ['H', 'e', 'l', 'l', 'o', ' ', 'W', 'o', 'r', 'l', 'd']
```



### isinstance()

用来判断一个对象是否是一个已知的类型

用法：

```python
isinstance(object, classinfo)
```

参数：

- object -- 实例对象
- classinfo -- 可以是直接或间接类名、基本类型或者由它们组成的元组

返回值：如果对象的类型与参数二的类型（classinfo）相同则返回 True，否则返回 False



例子：

```python
>>>a = 2
>>> isinstance (a,int)
True
>>> isinstance (a,str)
False
>>> isinstance (a,(str,int,list))    # 是元组中的一个返回 True
True
```

## 定义函数

在Python中，定义一个函数要使用`def`语句，

然后，依次写出函数名、括号、括号中的参数和冒号`:`

然后，在缩进块中编写函数体，函数的返回值用`return`语句返回

如：

```python
def my_abs(x):
    if x >= 0:
        return x
    else:
        return -x

```

函数体内部的语句在执行时，一旦执行到`return`时，函数就执行完毕，并将结果返回

就算没有`return`语句，函数执行完毕后也会返回结果，只是结果为`None`



使用别的文件的函数时，需要先用`from abstest import my_abs`来导入`my_abs()`函数，注意`abstest`是文件名（不含`.py`扩展名）



### 空函数

若想定义一个什么事也不做的空函数，可以用`pass`语句，如：

```python
def nop():
    pass
```

其实`pass`相当于一个占位符，没有的话会报错



### 参数检查

调用函数时，如果参数个数不对，Python解释器会自动检查出来，并抛出`TypeError`

但如果参数类型不对，Python解释器就无法帮我们检查

所以，在定义函数时，需要自行检查参数类型

```python
def my_abs(x):
    if not isinstance(x, (int, float)):
        raise TypeError('bad operand type')
    if x >= 0:
        return x
    else:
        return -x
```

### 返回多个值

在python中可以返回多个值，如：

```python
def hello():
    res1='hello'
    res2='world'
    return res1,res2

res1,res2=hello()
print("res1: ",res1,"  res2: ",res2)
res=hello()
print(res)
print("res: ",res[0],res[1])

# 输出
# res1:  hello   res2:  world
# ('hello', 'world')
# res:  hello world
```

由输出结果可知，函数返回值是一个tuple



### 参数

**位置参数：**

在给函数传参数时，如果不加参数名的话，需要对应好位置，所以，这参数也叫**位置参数**

```python
def enroll(name, gender, age, city):
    print('name:', name)
    print('gender:', gender)
    print('age:', age)
    print('city:', city)

# 下面两个等价
enroll('xiao hu','M',21,'Hunan')     
enroll(gender='M',name='xiao hu',city='Hunan',age=21)
```



**默认参数：**

指参数的默认值，如：

```python
def power(x,n=2):
    s=1
    while(n>0):
        n=n-1
        s=s*x
    return s    

s=power(2)  # s=4
```

注意点一：在定义函数时，必选参数在前，默认参数在后

注意点二：当有多个默认参数时，在调用时，以下几点需要注意：

```python
def enroll(name, gender, age=6, city='Beijing'):
    print('name:', name)
    print('gender:', gender)
    print('age:', age)
    print('city:', city)
    
enroll('xiao hu','F')  # 没问题
enroll('xiao hu','F',12)  # 没问题
enroll('xiao hu','F',12,'Hunan')  # 没问题
enroll('xiao hu','F','Hunan')  # 有问题
enroll('xiao hu','F',city='Hunan') # 没问题
enroll('xiao hu','F',age=12,city="Hunan") # 没问题
```

当不按顺序提供默认参数时，需要把参数名写上

注意点三：默认参数必须指向不变对象，否则：

```python
def add_end(L=[]):
    L.append('END')
    return L

add_end()   # ['END']
add_end()   # ['END','END']
add_end()   # ['END','END','END']
```

其实默认参数L也是一个变量，它指向可变对象`[]`，每次调用该函数时，L所指向的对象都会发生变化。修改版：

```python
def add_end(L=None):
    if L is None:
        L = []
    L.append('END')
    return L
```



**可变参数：**

可变参数就是传入的参数个数是可变的，可以是1个、2个到任意个，还可以是0个

可变参数定义方法：在参数前加一个`*`，而在函数内部，可变参数部分接收到的是一个tuple，例子：

```python
def calc(*numbers):
    sum=0
    for n in numbers:
        sum=sum+n*n
    return sum

calc(1,2)  # 5
calc()  # 0
calc(1,2,3) # 14
```

如果已经有一个list或者tuple，需要将list或tuple里的数据传入可变参数，可在list或tuple前加一个`*`。例子：

```python
nums=[1,2,3]
calc(*nums)  # *nums表示把nums中的所有元素作为可变参数传进去
```



**关键字参数：**

关键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个dict，关键字参数定义方法：在参数名前加`**`。例子：

```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)

# 输出：name: Michael age: 30 other: {}    
person('Michael', 30)

#  输出：name: Bob age: 35 other: {'city': 'Beijing'}
person('Bob', 35, city='Beijing')  

# 输出：name: Adam age: 45 other: {'gender': 'M', 'job': 'Engineer'}
person('Adam', 45, gender='M', job='Engineer')  
```

如果已经有一个dict，需要将dict中的数据传入关键字参数中，可以在dict前加`**`，例子：

```python
extra = {'city': 'Beijing', 'job': 'Engineer'}

# 输出：name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'}
person('Jack', 24, **extra)
```



## 主函数

python程序是从开始到结尾的顺序执行，定义主函数可以使python程序直接执行主函数内的代码。

格式：

```python
if __name__ == '__main__':
    ……
```







# 高级特性

## 切片(Slice)

在python中，有序序列都支持切片，如列表、字符串、元组

格式：`[start:end:step]`

- start：起始索引，默认从0开始
- end：结束索引，-1表示结束，默认
- step：步长，默认1，当步长>0，从左往右跑，反之从右往左跑





# 面向对象

## 类和实例

类的例子：

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

# class 类名(父类):
# 类名：Net
# 是nn.Module的子类，即继承于nn.Module
# 在python中，所有类的继承于object
class Net(nn.Module):
	
    # 构造函数
    # 第一个参数永远是self,表示创建的实例本身,相当于this，用于给对象绑定变量属性
    # 在创建对象实例时，self参数不需要传入值
    def __init__(self):
        super(Net, self).__init__()
        # 1 input image channel, 6 output channels, 5x5 square convolution
        # kernel
        self.conv1 = nn.Conv2d(1, 6, 5)
        self.conv2 = nn.Conv2d(6, 16, 5)
        # an affine operation: y = Wx + b
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)
        
        
    # 定义类的方法
    # 第一个参数依然是self,表示创建的实例本身,相当于this
    # 在调用该函数时，self参数依旧无需传入值
    # 而其他参数需要传入值
    def forward(self, x):
        # Max pooling over a (2, 2) window
        x = F.max_pool2d(F.relu(self.conv1(x)), (2, 2))
        # If the size is a square you can only specify a single number
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)
        x = x.view(-1, self.num_flot_features(x))
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

    def num_flat_features(self, x):
        size = x.size()[1:]  # all dimensions except the batch dimension
        num_features = 1
        for s in size:
            num_features *= s
        return num_features

# 创建一个实例对象，self参数无须传入值
net = Net()
print(net)
```















