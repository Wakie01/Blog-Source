---
title: Logback配置文件详解
comment: true
date: 2021-08-17 21:03:55
tags:
categories:
addrlink:
---







# 配置文件



模板：

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!-- 日志级别从低到高分为TRACE < DEBUG < INFO < WARN < ERROR < FATAL，如果设置为WARN，则低于WARN的信息都不会输出 -->

<!-- 
 根节点<configuration>，包含下面三个属性：
 scan: 当此属性设置为true时，配置文件如果发生改变，将会被重新加载，默认值为true。
 scanPeriod: 设置监测配置文件是否有修改的时间间隔，如果没有给出时间单位，默认单位是毫秒。当scan为true时，此属性生效。默认的时间间隔为1分钟。
 debug: 当此属性设置为true时，将打印出logback内部日志信息，实时查看logback运行状态。默认值为false。
-->
<configuration scan="true" scanPeriod="60 seconds" debug="false">
    <!-- 用于指定logger上下文名称，默认为default -->
    <contextName>ourApp</contextName>

    <!-- name的值是变量的名称，value的值时变量定义的值。通过定义的值会被插入到logger上下文中。定义变量后，可以使“${}”来使用变量。 -->
    <!-- 设置变量FILE_PATH，用于指定名为FILE的appender的目的文件存放的目录 -->
    <property name="log_path" value="log"/>

	<property name="console_pattern" value="%d{yyyy-MM-dd HH:mm:ss.SSS}  %highlight(%-5level) --- [%15.15(%thread)] %cyan(%-36.36(%logger{36})) : %msg%n" />

	<property name="file_pattern" value="%d{yyyy-MM-dd HH:mm:ss.SSS}  %-5level --- [%15.15(%thread)] %-36.36(%logger{36}) : %msg%n" />

    <!-- ************************常用的Appender************************************** -->
    <!--
        <appender>标签包含2个属性：name、class
        name属性：指定appender名称;
        class属性：指定哪种输出策略，常用就是控制台输出策略(ConsoleAppender)和文件输出策略(FileAppender)和动态文件策略(RollingFileAppender)
        class属性的值决定了<appender>标签包含的子标签的种类。
    -->
    <!--
        ConsoleAppender的功能是将记录信息以特定格式写到控制台
        ConsoleAppender的子标签有：encoder，target
    -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!--encoder:将事件转换为字符串
            默认配置为PatternLayoutEncoder类
            encoder用于替代Layout，encoder扩展了Layout功能
            Layout功能：只负责把事件转换为字符串，但是不能指定何时将记录写入到指定目的地
            encoder功能：即负责把事件转换为字符串，也可以指定何时将记录写入到指定目的地
         -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!-- 指定输出格式
                %d{} :表示时间
                %thread:请求记录所在的线程名
                %-5level：用5位显示请求级别
                %15.15():如果记录的线程字符长度小于15(第一个)则用空格在左侧补齐,如果字符长度大于15(第二个),则从开头开始截断多余的字符
                %logger{36}：输出logger名，{36}表示logger名最大占用的字符位数，{0}表示最简短logger名（不包含包名）。
                %highlight()：颜色，info为蓝色，warn为浅红，error为加粗红，debug为黑色
                %cyan(): 蓝绿色
                %msg：日志输出内容
                %n：换行符
             -->
            <pattern>${console_pattern}</pattern>
			<charset>UTF-8</charset>
		</encoder>
    </appender>


    <!--
        *****************************根据时间滚动 为滚动规则和条件的appender(最常用)***********************
        RollingFileAppender类型的appender中必须包含4个子标签：<file>、<rollingPolicy>、<triggerPolicy>、<encoder>
        <rollingPolicy>标签用于指定滚动规则，该标签有一个属性class：用于指定实现具体的滚动规则的类。
        <triggerPolicy>标签用于指定发生滚动的条件，该标签有一个属性class：用于指定具体滚动条件的类。
        <rollingPolicy>和<triggerPolicy>中具体包含哪些子标签是由class属性指定的类来决定的，因为不同的类有不同的参数，从而需要不同的标签来传参
     -->
	<appender name="TRACE_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<!-- 正在记录的日志文件的路径及文件名 -->
		<file>${log_path}/log_trace.log</file>
		<encoder>
			<pattern>${file_pattern}</pattern>
			<charset>UTF-8</charset>
		</encoder>

		<!-- TimeBasedRollingPolicy实现了RollingPolicy与TriggeringPolicy，
            因此只需要<rollingPolicy>标签，不需要<TriggeringPolicy>标签
			TimeBasedRollingPolicy是每天进行滚动的
            <rollingPolicy>标签有两个子标签：<fileNamePattern>、<maxHistory>
            <fileNamePattern>：用于指定文件名命名规则
            <maxHistory>：保留文件的个数，超过了就删除创建时间最久的文件
         -->
		<rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
			<!-- 文件名格式 -->
			<fileNamePattern>${log_path}/trace/log-trace-%d{yyyy-MM-dd}.log</fileNamePattern>
			<maxHistory>10</maxHistory>
		</rollingPolicy>

		<!-- Level过滤器，只记录trace级别的日志 -->
		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>trace</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>

	</appender>


    <appender name="DEBUG_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${log_path}/log_debug.log</file>
		<encoder>
            <pattern>${file_pattern}</pattern>
			<charset>UTF-8</charset>
		</encoder>

        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_path}/debug/log-debug-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>10</maxHistory>
        </rollingPolicy>

		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>debug</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
    </appender>
	
	
	<appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${log_path}/log_info.log</file>
		<encoder>
            <pattern>${file_pattern}</pattern>
			<charset>UTF-8</charset>
		</encoder>
		
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_path}/info/log-info-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>10</maxHistory>
        </rollingPolicy>
		
		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>info</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
    </appender>


	<appender name="WARN_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${log_path}/log_warn.log</file>
		<encoder>
            <pattern>${file_pattern}</pattern>
			<charset>UTF-8</charset>
		</encoder>
		
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_path}/info/log-warn-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>10</maxHistory>
        </rollingPolicy>
		
		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>warn</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
    </appender>


	<appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<file>${log_path}/log_error.log</file>
		<encoder>
            <pattern>${file_pattern}</pattern>
			<charset>UTF-8</charset>
		</encoder>
		
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${log_path}/info/log-error-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>10</maxHistory>
        </rollingPolicy>
		
		<filter class="ch.qos.logback.classic.filter.LevelFilter">
			<level>error</level>
			<onMatch>ACCEPT</onMatch>
			<onMismatch>DENY</onMismatch>
		</filter>
    </appender>
	
	
	<!-- 
		logger: 用来设置某一个包或者具体的某一个类的日志打印级别 
		logger有三个属性：name、level、addtivity
			name: 指定受此loger约束的某一个包或者具体的某一个类
			level:用来设置打印级别（日志级别），大小写无关
			addtivity:是否向上级logger(也就是)传递打印信息。默认是true
		<logger>可以包含零个或多个<appender-ref>元素，标识这个appender将会添加到这个logger
	-->
	<logger name="com.my.ourapp.mapper" level="DEBUG" />
	<logger name="com.my.ourapp.shiro" level="TRACE" />
	<logger name="com.my.ourapp.socket" level="DEBUG" />
	
	<!--
		<root>其实也是<logger>元素，但是它是根logger
		它只有一个level属性，用来设置打印级别，大小写无关，默认Debug
		<root>可以包含零个或多个<appender-ref>元素，标识这个appender将会添加到root中
	-->
    <root level="info">
        <appender-ref ref="STDOUT" />
		<appender-ref ref="TRACE_FILE" />
		<appender-ref ref="DEBUG_FILE" />
		<appender-ref ref="INFO_FILE" />
		<appender-ref ref="WARN_FILE" />
		<appender-ref ref="ERROR_FILE" />
    </root>

</configuration>
```

