---
title: Java多线程学习
comment: true
date: 2020-11-18 09:37:30
tags: Java
categories: BackEnd
addrlink: 1130
---


# 进程与线程

**进程：**

​	每个进程都有独立的代码的数据空间（进程上下文），进程间的切换会有较大的开销，一个进程包含1~n个线程。	

​	多进程：指OS能同时运行多个任务（程序）

> 进程是资源分配的最小单位

**线程：**

​	同一类线程共享代码和数据空间，每个线程都有独立的运行栈和程序计数器（PC），线程切换开销小。

​	多线程：指在同一个程序中有多个顺序流在执行

> 线程是CPU调度的最小单位

线程和进程一样分为五个阶段：创建、就绪、运行、阻塞、终止

------

值得注意的是：

- 线程是独立的执行路径

- 在程序运行时，即使自己没有创建线程，后台也会有多个线程，如main()主线程，垃圾回收线程（gc线程）

- 在一个进程中，若开辟了多个线程，线程的运行由调度器安排调度，调度器是与OS紧密相关的，先后顺序不能人为干预

- 对同一份资源操作时，会存在资源抢夺的问题，so需要加入并发控制

- 线程会带来额外的开销，如cpu调度时间，并发控制开销

- 每个线程在自己的工作内存中交互，内存控制不当会造成数据不一致

# 常见线程名词

- **主线程：** JVM调用程序Main()所产生的线程

- **当前线程：** 当前运行的线程，可通过Thread.currentThread()获取

- **守护线程（Daemon）：** 也叫后台线程，指为其他线程提供服务的线程，JVM的垃圾回收线程就是一个后台线程

- **前台线程：** 指接受后台线程服务的线程

- **对象锁：** 

  可以理解为对象的钥匙，一个对象只有一把对象锁。

  当一个对象中有同步方法、同步块时，当线程调用此对象并进入该同步区域时，必须要先获得对象锁，如果此对象的对象锁被其它线程占用，则会进入阻塞队列，等待此对象锁的释放。

  注意，线程执行完同步方法、同步块后，就会马上把对象锁还给该对象。

  这样就保证了同步方法、同步块每时每刻都只能有一个线程在执行。

- **方法锁：** 方法锁也是一种对象锁

- **类锁：** 

  可以理解为类的钥匙，一个类只有一把类锁

  当一个类中有同步静态的东西时（包括变量、方法、块），当线程调用此类中的同步静态东西时，必须要先获得类锁，类似于对象锁。

  类锁保证了类中的同步静态东西每时每刻都只能有一个线程在执行



# JAVA实现多线程

Java实现多线程，常用的有两种方法：

1. 继承Thread类

2. 实现Runnable接口

3. 实现Callable接口

两者对比，第二种方法更常用



## 继承Thread类

**使用：**

​	新建一个类，继承java.lang.Thread类，重写run()方法

​	执行时调用线程类的start()方法



**例子：**

```java
public class Thread1 extends Thread {
    private String name;
    
    public Thread1(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        for(int i=0;i<10;i++){
            System.out.println(name+" 运行： "+i);
            try {
                sleep((int)Math.random()*10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Thread1 thread1=new Thread1("hello");
        Thread1 thread2=new Thread1("world");
        thread1.start();
        thread2.start();
        for(int i=0;i<5;i++){
            System.out.println("main 运行： "+i);
            try {
                sleep((int)Math.random()*10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**输出：**

<div style="width:40%;margin:auto">

![img1](./Java多线程学习/1.png)

</div>

再执行一下输出：

<div style="width:30%;margin:auto">

![img2](./Java多线程学习/2.png)

</div>



**说明：**

​	程序启动执行main()时，Java虚拟机启动了一个进程，主线程main在main()调用时被创建

​	随着调用Thread1的两个对象的start()方法，另外两个线程也启动了

​	这样，整个应用就在多线程下运行

> main()方法其实也是一个线程，
>
> 在Java中所有的线程都是同时启动的，至于什么时候，哪个先执行，完全看谁先得到CPU的资源
>
> 每次运行Java程序至少启动2个线程：main线程、垃圾收集线程
>
> 每运行一个Java程序，都会启动一个JVM，这个JVM其实就是一个进程



**注意：**

1. 调用start()方法后，并不是立即执行多线程代码，而是使该线程变为可运行态（Runnable），至于什么时候运行是由OS决定的
   
2. 多线程程序是乱序执行的，因此，对于乱序执行的代码，为了加快速度，可设计为多线程
   
3. 调用Thread.sleep()的目的是：不让当前线程独自霸占该进程所获取的CPU资源，从而留出一定时间给其它线程执行的机会
   
4. 重复调用start()方法的话，会出现java.lang.IllegalThreadStateException异常

> 可运行态（Runnable），我感觉也就是就绪



## 实现Runnable接口

**使用：**

​	新建一个类，实现Runnable接口，然后重写run()方法



**例子：**

```java
public class SaySomething implements Runnable{
    private String name;

    public SaySomething(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        for(int i=0;i<5;i++){
            System.out.println(name+" 运行： "+i);
            try {
                Thread.sleep((int)Math.random()*10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Thread thread1=new Thread(new SaySomething("hello"));
        Thread thread2=new Thread(new SaySomething("world"));
        thread1.start();
        thread2.start();
        for(int i=0;i<5;i++){
            System.out.println("main 运行： "+i);
            try {
                sleep((int)Math.random()*10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

**输出：**


<div style="width:50%;margin:auto">

![img2](./Java多线程学习/3.png)

</div>

再执行一次输出：


<div style="width:50%;margin:auto">

![img2](./Java多线程学习/4.png)

</div>

**说明：**

1. SaySomething类通过实现Runnable接口，使得该类有了多线程类得特征
2. run()方法是多线程程序得一个约定，所有的多线程代码都在run()方法里
3. 其实java.lang.Thread类也是实现了Runnable接口的类
4. 在启动多线程时，需要先通过Thread类的构造方法Thread(Runnable target)构造出对象，然后调用Thread对象的start()方法来运行多线程代码
5. 其实所有的多线程代码都是通过运行Thread的start()方法来运行的



**例子2：**

```java
//兔龟赛跑
public class TestThread5 implements Runnable{

    private String winner;

    @Override
    public void run() {
        for (int i=1;i<=2000;i++){
            if(Thread.currentThread().getName().equals("兔子") && i%500==0){
                try {
                    Thread.sleep(20);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            if(gameOver(i)){
                break;
            }
            System.out.println(Thread.currentThread().getName()+" ---> 跑了"+i+"步");

        }
    }

    public boolean gameOver(int step){
        if(winner!=null){
            return true;
        }else if(step==2000){
            winner=Thread.currentThread().getName();
            System.out.println(winner+" ---> 跑了2000步");
            System.out.println("winner is "+winner);
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        TestThread5 testThread5=new TestThread5();
        new Thread(testThread5,"兔子").start();
        new Thread(testThread5,"乌龟").start();
    }
}

```



## Thread和Runnable的区别

如果一个类继承Thread，则不适合资源共享

如果一个类实现Runnable接口的话，则更容易实现资源共享

> 在Java中，一个类只能继承一个类，但可以实现多个接口



实现Runnable的优势：

1. 适合多个相同的程序代码的线程去处理同一个资源（还没体会到）

2. 可避免Java中单继承的限制

3. 增加程序的健壮性，代码可被多个线程共享，代码和数据独立（也还没体会到）

4. 线程池只能放入实现Runnable或Callable类的线程，不能直接放入继承Thread的类

**例子：**

```java
public class TestThread4 implements Runnable{

    private int ticket=10;

    @Override
    public void run() {
        while (true){
            try {
                if(ticket==0) break;
                System.out.println(Thread.currentThread().getName()+"  --->拿到了第"+ticket--+"票");
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        }
    }

    public static void main(String[] args) {
        TestThread4 testThread4=new TestThread4();
        new Thread(testThread4,"A").start();
        new Thread(testThread4,"B").start();
        new Thread(testThread4,"C").start();
    }
}
```

**输出：**

<img src=".\Java多线程学习\13.png" alt="image-20210212234251178" style="zoom:80%;" />





## 实现Callable接口

步骤：

1. 实现Callable接口，需要返回值类型

2. 重写call()方法

3. 创建目标对象

4. 创建执行服务

   ```java
   ExecutorService ser=Executors.newFixedThreadPool(1);
   ```

5. 提交执行

   ```java
   Future<Boolean> result1=ser.submit(t1);
   ```

6. 获取结果

   ```java
   boolean r1=result1.get();
   ```

7. 关闭服务

   ```java
   ser.shutdownNow();
   ```

**例子：**

```java
public class TestThread6 implements Callable<Boolean> {

    private String url;
    private String name;

    public TestThread6(String url, String name) {
        this.url = url;
        this.name = name;
    }

    public Boolean call() throws Exception {
        downloadPicture(url,name);
        System.out.println("下载了文件： "+name);
        return true;
    }

    public void downloadPicture(String url,String name) throws IOException {
        String path="D:/Java workspace/multiThreadLearn/resources/images/";
        FileUtils.copyURLToFile(new URL(url),new File(path+name));
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        //创建目标对象
        TestThread6 t1=new TestThread6("http://www.bingimg.cn/down/uhd/OHR.TheCobb_ZH-CN9310074102_UHD.jpg","image1.jpg");
        TestThread6 t2=new TestThread6("http://www.bingimg.cn/down/uhd/OHR.Lunarnewyeareve2021_ZH-CN4947947831_UHD.jpg","image2.jpg");
        TestThread6 t3=new TestThread6("http://www.bingimg.cn/down/uhd/OHR.BluebirdsEastern_ZH-CN2598458880_UHD.jpg","image3.jpg");

        //创建执行服务
        ExecutorService executorService= Executors.newFixedThreadPool(3);    //3个线程

        //提交执行
        Future<Boolean> result1=executorService.submit(t1);
        Future<Boolean> result2=executorService.submit(t2);
        Future<Boolean> result3=executorService.submit(t3);

        //获取结果
        boolean r1=result1.get();
        boolean r2=result1.get();
        boolean r3=result1.get();

        //关闭服务
        executorService.shutdownNow();
    }
}
```

**结果：**

<img src=".\Java多线程学习\14.png" alt="image-20210222112211883" style="zoom:80%;" />

其中：image3.jpg：1.18MB，image1.jpg：3.82MB，image2.jpg：10.0MB



## 线程状态转换


<div style="width:100%;margin:auto">

![img2](./Java多线程学习/5.png)

</div>



在JAVA中，Thread有5种状态：

1. `NEW`，线程创建状态，即初始状态
2. `RUNNABLE`，可运行状态
3. `BLOCKED`，阻塞状态
4. `WAITING`，等待状态
5. `TIME_WAITING`，等待状态，等待一个确定的时间
6. `TERMINATED`，终止结束状态

这些都可从`Thread.State`中看到

**例子：**

输出线程状态

```java
public class StateLearn {

    public static void main(String[] args) throws InterruptedException {
        //Lamda表达式
        Thread thread=new Thread(()->{
            for (int i = 0; i < 5; i++) {
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        System.out.println(thread.getState());  //NEW

        thread.start();
        System.out.println(thread.getState());  //RUNNABLE

        while(thread.getState()!= Thread.State.TERMINATED){
            Thread.sleep(100);
            System.out.println(thread.getState());
        }
    }

}
```





说一下**阻塞状态（Blocked）**

阻塞状态是线程因为某种原因放弃CPU使用权，暂时停止运行，直到线程进入就绪状态，才有机会转到运行状态。

阻塞的情况有三种：

1. 等待阻塞：运行的线程执行wait()方法，JVM会将该线程放入等待池中。（wait会释放持有的锁）
   
2. 同步阻塞：运行的线程在获取对象的同步锁时，若该同步锁被别的线程占用，则JVM会把该线程放入锁池中
   
3. 其它阻塞：运行的线程执行sleep()或join()方法，或者发出了I/O请求时，JVM会把该线程置为阻塞状态。当sleep()状态超时、join()等待线程终止或者超时、I/O处理完成时，线程会重新转入就绪状态。（sleep不会释放持有的锁）



## Thread常用API

### 优先级

通过调整线程的优先级，使优先级高的线程获得较多的运行机会

Java线程的优先级用int表示，取值范围：1~10，Thread也有3个关于优先级的静态常量：

```java
//Thread类的部分源代码
public class Thread implements Runnable{
    
    public final static int MIN_PRIORITY = 1;   //The minimum priority that a thread can have.
	public final static int NORM_PRIORITY = 5;   //The default priority that is assigned to a thread.
	public final static int MAX_PRIORITY = 10;    //The maximum priority that a thread can have.
    
    public final void setPriority(int newPriority){...}    //设置优先级
    
    //获取优先级
    public final int getPriority() {
        return priority;
    }
}

```

**注意：**

- 线程的优先级有继承关系，比如A线程创建了B线程，那么B线程与A线程有相同的优先级
- JVM虽然提供了10个线程优先级，但与常见的操作系统都不能很好的映射，所以最好只使用那3个静态变量来设置线程优先级



### 线程睡眠

```java
Thread.sleep(long millis)；
```

使线程转到阻塞状态，millis参数设定睡眠的时间，单位：毫秒。当睡眠结束后，就转为就绪（Runnable）状态，sleep()平台移植性好。

- 它可以用来模拟网络延时，有助于放大问题的发生性

- sleep()不会释放锁

### 线程等待

```java
Object.wait();
Object.wait(long timeout);     //超时被唤醒
```

使当前的线程等待，直到其它线程调用此对象的notify()或notifyAll()唤醒

不过，wait()方法只能在`同步控制方法`或者`同步控制块`里使用，即要与`synchronized`关键字连用

还有，wait()方法会释放`对象锁`

### 线程唤醒

```java
Object.notify();       //唤醒此对象监视器上的随意一个等待的线程
Object.notifyAll();     //唤醒此对象监视器上的所有等待的线程
```

注意：wait()、notify()、synchronized这三个一般是连着用的

**例子：**

```java
public class NotifyDemo {
    public static void main(String[] args) {
        byte[] obj=new byte[0];     //用来表示一个对象锁
        Thread download=new Thread(){
            public void run(){
                System.out.println("开始下载图片");
                for (int i=0;i<=100;i+=20){
                    System.out.println("already download "+i+"%");
                    try {
                        sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("图片下载成功");
                synchronized (obj){
                    obj.notify();    //释放obj对象锁
                }
                System.out.println("开始下载附件");
                for (int i=0;i<=100;i+=20){
                    System.out.println("already download "+i+"%");
                    try {
                        sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("附件下载成功");
            }
        };
        Thread show=new Thread(){
            public void run(){
                synchronized (obj){
                    try {
                        obj.wait();     //锁上obj
                        System.out.println("show: 开始展示图片");
                        sleep(2000);
                        System.out.println("图片展示完毕");
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
        };
        download.start();
        show.start();
    }
}
```

**结果：**


<div style="width:70%;margin:auto">

![img2](./Java多线程学习/12.png)

</div>

### 线程让步

```java
Thread.yield(); 
```

暂停当前正在执行的线程对象，把执行机会让给相同或优先级更高的线程

具体来说，就是：让当前运行线程回到可运行状态，以允许具有相同优先级的其他线程获得运行机会

> **注意：**yield()从未导致线程转到等待/睡眠/阻塞状态

因此，使用yield()的目的是让相同优先级的线程之间能适当的轮转执行。但是，实际中无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中

**例子：**

```java
public class YieldLearn {
    public static void main(String[] args) {
        new NumPrint("A").start();
        new NumPrint("B").start();
    }
}

class NumPrint extends Thread{

    NumPrint(String name){
        super(name);
    }

    @Override
    public void run() {
        for(int i=0;i<10;i++){
            System.out.println(currentThread().getName()+" is running "+i);
            if(i==5){
                yield();
            }
        }
    }
}
```

**输出：**

<div style="width:50%;margin:auto">

![img11](./Java多线程学习/11.png)

</div>

还有很多种输出。。。。

### 线程加入

```java
Thread.join();
```

等待该线程终止

表示一个线程A加入到当前运行的线程B中，当运行到加入的那个线程A时，当前运行的线程B就会进入阻塞状态，然后线程A进入运行状态，当线程A运行结束时，线程B才会再回到就绪状态。可以理解成`插队`

**例子1：**

```java
public class JoinLearn {
    public static void main(String[] args) throws InterruptedException {
        System.out.println(Thread.currentThread().getName()+" begin running");
        NumPrintThread numPrint1=new NumPrintThread("numPrint1");
        numPrint1.start();
        System.out.println(Thread.currentThread().getName()+" is still running1");
        numPrint1.join();
        System.out.println(Thread.currentThread().getName()+" is still running2");
        System.out.println(Thread.currentThread().getName()+" end running");
    }
}

class NumPrintThread extends Thread{

    public NumPrintThread(String name){
        super(name);
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName()+" begin running");
        for(int i=0;i<10;i++){
            System.out.println(Thread.currentThread().getName()+" is running:  "+i);
        }
        System.out.println(Thread.currentThread().getName()+" end running");
    }
}
```

一开始，Main线程运行，当执行了numPrint1.join()时，Main线程进入阻塞状态，numPrint1运行，numPrint1运行结束后，Main继续运行

**输出：**

<div style="width:70%;margin:auto">

![img6](./Java多线程学习/6.png)

</div>

**例子2：**

```java
public class JoinLearn {
    public static void main(String[] args) throws InterruptedException {
        System.out.println(Thread.currentThread().getName()+" begin running");

        NumPrintThread numPrint1=new NumPrintThread("numPrint1");
        numPrint1.start();

        NumPrintThread numPrint2=new NumPrintThread("numPrint2");
        numPrint2.start();

        System.out.println(Thread.currentThread().getName()+" is still running1");

        numPrint1.join();

        System.out.println(Thread.currentThread().getName()+" is still running2");
        System.out.println(Thread.currentThread().getName()+" end running");
    }
}

class NumPrintThread extends Thread{

    public NumPrintThread(String name){
        super(name);
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName()+" begin running");
        for(int i=0;i<5;i++){
            System.out.println(Thread.currentThread().getName()+" is running:  "+i);
        }
        System.out.println(Thread.currentThread().getName()+" end running");
    }
}
```

一开始，Main线程运行，当运行到numPrint1.join()时，Main线程进入阻塞状态，然后numPrint1线程与numPrint2线程随机、没有顺序地执行，当numPrint1线程运行结束时，Main线程可以重回运行状态了，若是numPrint2线程还没运行结束，则Main线程会与numPrint2线程随机、没有顺序地执行

**输出：**

<div style="width:70%;margin:auto">

![img2](./Java多线程学习/7.png)

</div>

<div style="width:70%;margin:auto">

![img2](./Java多线程学习/8.png)

</div>

<div style="width:70%;margin:auto">

![img2](./Java多线程学习/9.png)

</div>



**例子3：**

```java
public class JoinLearn {
    public static void main(String[] args) throws InterruptedException {
        System.out.println(Thread.currentThread().getName()+" begin running");

        NumPrintThread numPrint1=new NumPrintThread("numPrint1");
        numPrint1.start();

        NumPrintThread numPrint2=new NumPrintThread("numPrint2");
        numPrint2.start();
        numPrint2.sleep(5000);
        
        System.out.println(Thread.currentThread().getName()+" is still running1");

        numPrint1.join();

        System.out.println(Thread.currentThread().getName()+" is still running2");
        System.out.println(Thread.currentThread().getName()+" end running");
    }
}

class NumPrintThread extends Thread{

    public NumPrintThread(String name){
        super(name);
    }

    @Override
    public void run() {
        System.out.println(Thread.currentThread().getName()+" begin running");
        for(int i=0;i<5;i++){
            System.out.println(Thread.currentThread().getName()+" is running:  "+i);
        }
        System.out.println(Thread.currentThread().getName()+" end running");
    }
}
```

我本来的想法是：Main线程先执行，然后中途阻塞，然后numPrint1执行，numPrint2阻塞，numPrint1执行完了，到Main执行，最后才numPrint2执行

可是很奇怪，不管执行多少次，main is still running1，main is still running2，main end running这三句话永远是最后sleep完之后再执行，我本来是想让numPrint2阻塞，结果变成了Main的阻塞

为什么呢？

我想应该是这样的。numPrint2 继承 Thread，执行numPrint2.sleep()就就相当于执行Thread.sleep()，表示让该线程睡眠。即numPrint2.sleep()不是让numPrint2睡眠，而是让Main睡眠

**输出：**


<div style="width:70%;margin:auto">

![img2](./Java多线程学习/10.png)

</div>

**例子4：**

```java
public class JoinLearn implements Runnable {

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            System.out.println(Thread.currentThread().getName()+" run "+i);
        }
        System.out.println(Thread.currentThread().getName()+" finish");
    }

    public static void main(String[] args) throws InterruptedException {
        //启动线程
        JoinLearn joinLearn=new JoinLearn();
        Thread thread=new Thread(joinLearn,"VIP");
        thread.start();

        for (int i = 0; i < 50; i++) {
            if(i==30){
                //插队
                thread.join();
            }
            System.out.println("main run "+i);
        }
    }
}
```

**结果：** 一开始各自轮流运行，当main的i=30时，thread插队运行，当thread运行完之后，main再继续运行



### 守护线程(daemon)

- 线程分为用户线程和守护线程

- Java虚拟机(JVM)必须确保用户线程执行完毕

- JVM不用等待守护线程执行完毕

- 常见的守护线程有：后台记录操作日志、监控内存、垃圾回收等待……

守护线程设置：

```java
Thread.setDaemon(boolean on);     //默认为false，即用户线程
```

**例子：**

```java
public class DaemonLearn {
    public static void main(String[] args) {
        God god=new God();
        You you=new You();
        Thread godThread=new Thread(god);
        godThread.setDaemon(true);   //设置守护线程为true
        godThread.start();     //守护线程启动
        new Thread(you).start();      //用户线程启动
    }

}

//守护线程
class God implements Runnable{
    @Override
    public void run() {
        while (true){
            System.out.println("上帝守护着你");
        }
    }
}

//用户线程
class You implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 365; i++) {
            System.out.println("be happy...");
        }
        System.out.println("one year has passed...");
    }
}

```

## 线程停止

1. 建议线程正常停止，利用次数，不建议死循环

2. 建议使用标志位，设置一个标志位

3. 不要使用stop、destroy等过时的或者JDK不建议使用的方法

**例子：**

```java
public class StopLearn implements Runnable {

    //1. 设置一个标识位
    private boolean flag=true;

    @Override
    public void run() {
        int i=0;
        while(flag){
            System.out.println("run thread: "+i++);
        }
    }

    //2. 设置线程停止方法
    public void stop(){
        this.flag=false;
    }

    public static void main(String[] args) {
        StopLearn stopLearn = new StopLearn();
        new Thread(stopLearn).start();
        for (int i = 0; i < 100; i++) {
            if (i == 80) {
                stopLearn.stop();
                System.out.println("thread stop");
            }
            System.out.println("run main " + i);
        }
    }
}
```




# 线程同步

当多个线程操作同一个资源时，会出现线程不安全、数据紊乱的现象，这时就需要`线程同步`

线程同步主要指的是`synchronized关键字`的使用，使用`synchronized关键字`可实现对象锁、类锁

**线程不安全的例子1：**

```java
public class UnsafeBuyTicket {
    public static void main(String[] args) {
        BuyTicket station=new BuyTicket();
        new Thread(station,"A").start();
        new Thread(station,"B").start();
        new Thread(station,"C").start();
    }

}

class BuyTicket implements Runnable{

    private int ticket=10;
    boolean flag=true;

    @Override
    public void run() {
        while(flag){
            if(ticket<=0){
                System.out.println("票已卖完");
                flag=false;
                return ;
            }
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+" 买到票"+ticket--);
        }
    }
}
```

**结果：**

<img src=".\Java多线程学习\15.png" alt="image-20210303094541210" style="zoom:80%;" />

可见，由于每个线程都在自己的工作内存中交互，当内存控制不当时会造成数据不一致 ，比如A、B都买到票10，这是因为A、B线程都把票10拷贝到自己的线程内存中，所以它们都以为当时是票10

线程同步就是解决这种问题的，排队+上锁

**线程不安全例子二：**

```java
public class UnsafeBank {
    public static void main(String[] args) {
        Account account=new Account("小明",100.00);
        //三个人取钱
        new Drawing(account,50.00,"A").start();
        new Drawing(account,70.00,"B").start();
        new Drawing(account,60.00,"C").start();
    }
}

//账户
class Account{
    private String name;
    private Double money;

    public Account(String name, Double money) {
        this.name = name;
        this.money = money;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }
}

//取钱
class Drawing extends Thread{
    private Account account; //账户
    private Double drawingMoney;   //取多少钱

    Drawing(Account account,Double drawingMoney,String name){
        super(name);
        this.account=account;
        this.drawingMoney=drawingMoney;
    }

    @Override
    public void run() {
        if(account.getMoney()-drawingMoney<0){
            System.out.println(account.getName()+" 钱不够, "+currentThread().getName()+" 取不了");
            return ;
        }

        try {
            sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.print(account.getName()+" 银行卡余额有 "+account.getMoney()+" 钱, ");
        account.setMoney(account.getMoney()-drawingMoney);
        System.out.println(currentThread().getName()+" 取钱成功,取走了"+drawingMoney+"钱,现还有 "+account.getMoney()+"钱");
    }
}
```

**结果：**

<img src=".\Java多线程学习\16.png" alt="image-20210303102531451" style="zoom:80%;" />



**例子3：**

线程不安全集合

```java
public class UnsafeList {
    public static void main(String[] args)  {
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            new Thread(() -> {
                list.add(Thread.currentThread().getName());
            }).start();
        }
        System.out.println(list.size());     
    }
}
```

本来应该输出10000，结果却输出9000多



****

## 同步方法

- ***同步一般方法：***

  synchronized方法，可以防止多个线程同时访问这个对象的synchronized方法

  如果一个对象有多个synchronized方法，只要一个线程访问了其中一个synchronized方法，其它线程就不能访问这个对象的任何一个synchronized方法，注意，不同的对象实例的synchronized方法是互不干扰的，即其它线程可以同时访问相同类的另一个对象实例的synchronized方法，这就是对象锁

  还有，synchronized方法是不能继承的，继承类需要手动显式地指定synchronized方法，比如：

  ```java
  synchronized f(){}     //父类的方法
  f(){}      //继承之后，子类的方法就会变成这样，
  ```

  **使用：**

  ```java
  //写法一
  public synchronized void method(){
      // todo
  }
  
  //写法二
  public void method(){
      synchronized(this){      //这个this指的是调用这个方法的对象
          // todo
      }
  }
  ```

  写法一修饰的是一个方法，写法二修饰的是一个代码块，但写法一与写法二是等价的，都锁定了整个方法时的内容

  

  **例子一：**

  ```java
  public class SynchronizedLearn implements Runnable{
  
      @Override
      public void run() {
          printNum();
      }
  
      public synchronized void printNum(){
          for(int i=0;i<5;i++){
              System.out.println(Thread.currentThread().getName()+"  "+i);
          	try {
                  Thread.sleep(100);
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
      }
  
      public static void main(String[] args) {
          Thread A=new Thread(new SynchronizedLearn(),"A");
          Thread B=new Thread(new SynchronizedLearn(),"B");
          A.start();
          B.start();
      }
  }
  ```

  **结果：**

  A、B随机乱序运行

  因为上例新建了两个SynchronizedLearn对象，其对应两个不同的对象锁，而这两把锁是互不干扰的，不形成互斥，所以两个线程可以同时执行

  

  **例子二：**

  ```java
  public class SynchronizedLearn implements Runnable{
  
      @Override
      public void run() {
          printNum();
      }
  
      public synchronized void printNum(){
          for(int i=0;i<5;i++){
              System.out.println(Thread.currentThread().getName()+"  "+i);
          	try {
                  Thread.sleep(100);
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
      }
  
      public static void main(String[] args) {
          SynchronizedLearn synchronizedLearn=new SynchronizedLearn();
          Thread A=new Thread(synchronizedLearn,"A");
          Thread B=new Thread(synchronizedLearn,"B");
          A.start();
          B.start();
      }
  }
  ```

  **结果：**

  A先运行完，然后B再运行

  因为上例使用的就是同一个对象锁
  
  
  
  **例子三：**
  
  同步买票例子：
  
  ```java
  public class UnsafeBuyTicket {
      public static void main(String[] args) {
          BuyTicket station=new BuyTicket();
          new Thread(station,"A").start();
          new Thread(station,"B").start();
          new Thread(station,"C").start();
      }
  }
  
  class BuyTicket implements Runnable{
  
      private int ticket=10000;
      boolean flag=true;
  
      @Override
      public void run() {
          while(flag){
              buy();
          }
      }
  
      private synchronized void buy(){
          if(ticket<=0){
              System.out.println("票已卖完");
              flag=false;
              return ;
          }
          try {
              Thread.sleep(0);
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
          System.out.println(Thread.currentThread().getName()+" 买到票"+ticket--);
      }
  }
  ```
  
  其实synchronized同步方法锁的是对象，即：上面的buy()方法相当于下面的
  
  其实，synchronized默认锁的是this
  
  ```java
  private void buy(){
      synchronized(this){
          if(ticket<=0){
              System.out.println("票已卖完");
              flag=false;
              return ;
          }
          try {
              Thread.sleep(0);
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
          System.out.println(Thread.currentThread().getName()+" 买到票"+ticket--);
      }
  }
  ```
  
  
  
  
  
- ***同步静态方法：***

  synchronized静态方法，可以防止多个线程同时访问这个类的synchronized静态方法

  **使用：**

  ```java
  public synchronized static void method(){
      // todo 
  } 
  ```

  **例子：**

  ```java
  public class SynchronizedLearn implements Runnable{
  
      public synchronized static void printNum2(){
          for(int i=0;i<5;i++){
              System.out.println(Thread.currentThread().getName()+"  "+i);
          	try {
                  Thread.sleep(50);
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
      }
  
      @Override
      public void run() {
          printNum2();
      }
  
      public static void main(String[] args) {
          Thread A=new Thread(new SynchronizedLearn(),"A");
          Thread B=new Thread(new SynchronizedLearn(),"B");
          A.start();
          B.start();
      }
  }
  ```

  **结果：**

  A先运行完，然后B再运行

  毕竟是类锁

## 同步块

其使用方法与同步方法差不多

**使用：**

```java
public void method(Object object){
    synchronized(object){
        // todo
    }
}
```

synchronized的参数，指的是对象锁，运行该同步块需要获取的对象锁

如果没有明确的对象作为锁时，只是想让一段代码同步时，可以创建一个特殊的实例变量（它得是一个对象），如零长度的byte数组：

```java
private byte[] lock=new byte[0];

public void method(){
    synchronized(lock){
        // todo
    }
}
```

**例子一：**

同步取钱例子

在这个例子中，对account对象进行上锁，

```java
public class UnsafeBank {
    public static void main(String[] args) {
        Account account=new Account("小明",100.00);
        new Drawing(account,50.00,"A").start();
        new Drawing(account,70.00,"B").start();
        new Drawing(account,60.00,"C").start();
    }
}

//账户
class Account{
    private String name;
    private Double money;

    public Account(String name, Double money) {
        this.name = name;
        this.money = money;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMoney() {
        return money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }
}

//取钱
class Drawing extends Thread{
    private Account account; //账户
    private Double drawingMoney;   //取多少钱

    Drawing(Account account,Double drawingMoney,String name){
        super(name);
        this.account=account;
        this.drawingMoney=drawingMoney;
    }

    @Override
    public void run() {
        synchronized (account){
            if(account.getMoney()-drawingMoney<0){
                System.out.println(account.getName()+" 银行卡余额有"+account.getMoney()+" 钱, "+currentThread().getName()+" 取不了 "+drawingMoney+" 钱");
                return ;
            }

            try {
                sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.print(account.getName()+" 银行卡余额有 "+account.getMoney()+" 钱, ");
            account.setMoney(account.getMoney()-drawingMoney);
            System.out.println(currentThread().getName()+" 取钱成功,取走了"+drawingMoney+"钱,现还有 "+account.getMoney()+"钱");
        }

    }
}
```

**结果：**

<img src=".\Java多线程学习\17.png" alt="image-20210303111340343" style="zoom:80%;" />

为什么不是synchronized(this){}呢？

因为我们需要锁的对象就是变化的量，需要增删改的变量，而在这个例子中，变化的量是acount对象的钱，而不是银行



**例子二：**

同步ArrayList例子

在该例子中，因为变化的量为List，所以需要锁住List，可是发现锁住之后也不行，因为main线程先运行了，所以还要使用到join()方法

```java
public class UnsafeList {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            Thread thread = new Thread(() -> {
                //对list变量上锁
                synchronized (list) {
                    list.add(Thread.currentThread().getName());
                }
            });
            thread.start();
            try {
                //将thrad线程加入(插队)到主线程
                thread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println(list.size());
    }
}
```



## 同步类

实现类锁的方法，除了将`synchronized`修饰静态方法之外，还可将它修饰一个类

**使用：**

```java
Class ClassName {
    public void method(){
        synchronized(ClassName.class){
            // todo 
        }
    }
}
```

这意味着给ClassName这个类加锁，即ClassName的所有对象用的是同一把锁

**例子：**

```java
public class SyncThread implements Runnable{

    private static int count=0;

    public void method(){
        synchronized (SyncThread.class){
            for(int i=0;i<5;i++){
                System.out.println(Thread.currentThread().getName() + ":" + (count++));
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void run() {
        method();
    }

    public static void main(String[] args) {
        Thread A=new Thread(new SyncThread(),"A");
        Thread B=new Thread(new SyncThread(),"B");
        A.start();
        B.start();
    }
}
```

**结果：**

不是A先运行完，就是B先运行完





# 死锁

死锁是：多个线程互相抱着对方需要的资源，然后形成僵持

**例子：**

```java
public class DeadLockLearn {
    public static void main(String[] args) {
        new Makeup("John",0).start();
        new Makeup("Tony",1).start();
    }
}

//口红
class Lipstick{
}

//镜子
class Mirror{
}

//化妆
class Makeup extends Thread{

    //化妆需要口红跟镜子,然而口红跟镜子都只有一个
    private static Lipstick lipstick=new Lipstick();
    private static Mirror mirror=new Mirror();

    private String name;   //需要化妆的人
    private int choice;    //选择

    Makeup(String name,int choice){
        this.name=name;
        this.choice=choice;
    }

    @Override
    public void run() {
        try {
            doMakeup();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    public void doMakeup() throws InterruptedException {
        if(choice==0){
            synchronized (lipstick){
                System.out.println(name+" 拿到口红,涂口红了~");
                sleep(1000);
                synchronized (mirror){
                    System.out.println(name+" 拿到镜子,照镜子了~");
                    sleep(1000);
                    System.out.println(name+" 完成化妆");
                }
            }
        }else{
            synchronized (mirror){
                System.out.println(name+" 拿到镜子,照镜子了~");
                sleep(1000);
                synchronized (lipstick){
                    System.out.println(name+" 拿到口红,涂口红了~");
                    sleep(1000);
                    System.out.println(name+" 完成化妆");
                }
            }
        }
    }
}
```

**结果：**

<img src=".\Java多线程学习\18.png" alt="image-20210303200234420" style="zoom:80%;" />

Tony和John同时抱着对方需要的资源，不放手，所以形成死锁

**解决方法：**

用完就放手

```java
public void doMakeup() throws InterruptedException {
    if(choice==0){
        synchronized (lipstick){
            System.out.println(name+" 拿到口红,涂口红了~");
            sleep(1000);
        }
        synchronized (mirror){
            System.out.println(name+" 拿到镜子,照镜子了~");
            sleep(1000);
            System.out.println(name+" 完成化妆");
        }
    }else{
        synchronized (mirror){
            System.out.println(name+" 拿到镜子,照镜子了~");
            sleep(1000);
        }
        synchronized (lipstick){
            System.out.println(name+" 拿到口红,涂口红了~");
            sleep(1000);
            System.out.println(name+" 完成化妆");
        }
    }
}
```

**结果：**

<img src=".\Java多线程学习\19.png" alt="image-20210303200703021" style="zoom:80%;" />



产生死锁的四个必要条件：

1. 互斥条件：一个资源每次只能被一个进程使用

   > 口红与镜子只有一个

2. 请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放

   > 在因请求口红而阻塞时，对已获得的镜子保持不放

3. 不剥夺条件：进程已获得的资源，在未使用完之前，不能强行剥夺

   > 口红与镜子都不可剥夺

4. 循环等待条件：若干进程之间形成一种头尾相接的循环等待资源关系

   > Tony有口红，但在等镜子；John有镜子，但在等口红

因此，避免死锁，就是想办法破解这其中的任意一个或多个必要条件



# 经典问题

## 生产者与消费者模型

- 管程法

    **例子：**

    ```java
    public class PCLearn {
        public static void main(String[] args) {
            Container container = new Container();
            new Producer(container).start();
            new Consumer(container).start();
        }
    }

    //生产者
    class Producer extends Thread {
        private Container container;    //容器

        public Producer(Container container) {
            this.container = container;
        }

        @Override
        public void run() {
            try {
                produceChicken();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public void produceChicken() throws InterruptedException {
            for (int i = 0; i < 10; i++) {
                Chicken chicken = new Chicken(i);
                container.push(chicken);
                String time=Instant.now().toString();
                System.out.println(time+"---> 生产第 " + i + " 只鸡，其ID为 " + chicken.getId() + " ,现有 " + container.getCount() + " 只鸡");
                sleep(1500);
            }
        }
    }

    //消费者
    class Consumer extends Thread {
        private Container container;    //容器

        public Consumer(Container container) {
            this.container = container;
        }

        @Override
        public void run() {
            try {
                consumeChicken();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        public void consumeChicken() throws InterruptedException {
            for (int i = 0; i < 10; i++) {
                int chickenId=container.pop().getId();
                String time=Instant.now().toString();
                System.out.println(time+"---> 消费第 " + i + " 只鸡，其ID为 " + chickenId + " ,现还有 " + container.getCount() + " 只鸡");
                sleep(1000);
            }
        }
    }

    //产品
    class Chicken {
        private int id;   //产品ID

        public Chicken(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }
    }

    //容器，缓冲区
    class Container {
        private int capacity = 3;    //缓存区容量
        private Chicken[] chickens = new Chicken[capacity];    //缓冲区，容量为10
        private Integer count = 0;    //计数器

        public int getCount() {
            return count;
        }

        //放入产品,对容器设置锁
        public synchronized void push(Chicken chicken) throws InterruptedException {
            //缓冲区满了
            while (count == capacity) {
                //等待，并释放容器的锁
                wait();
            }
            //缓冲区没满,放入产品
            chickens[count++] = chicken;
            //有产品了,通知消费者拿产品
            notifyAll();
        }

        //拿出产品，对容器设置锁
        public synchronized Chicken pop() throws InterruptedException {
            //缓存区没产品
            while (count == 0) {
                wait();
            }
            //缓冲区有产品了
            Chicken chicken = chickens[--count];
            //消费了，通知生产者继续生产
            notifyAll();
            return chicken;
        }
    }
    ```

    结果：

    <img src=".\Java多线程学习\20.png" alt="image-20210304102028081" style="zoom:80%;" />

    由于线程运行顺序的不确定性，有时候会先输出消费，不过实际上它还是先生产的



- 信号灯法

  ```java
  public class PCLearn2 {
      public static void main(String[] args) {
          TV tv=new TV();
          new Actor(tv).start();
          new Watcher(tv,"Tony").start();
      }
  }
  
  //节目
  class Show{
      private int id;
  
      public Show(int id) {
          this.id = id;
      }
  
      public int getId() {
          return id;
      }
  
      public void setId(int id) {
          this.id = id;
      }
  }
  
  //表演者
  class Actor extends Thread{
      private TV tv;
  
      Actor(TV tv){
          this.tv=tv;
      }
  
      @Override
      public void run() {
          try {
              doPerform();
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
      }
  
      public void doPerform() throws InterruptedException {
          for (int i = 0; i < 10; i++) {
              Show show=new Show(i);
              tv.perform(show);
          }
      }
  }
  
  //观众
  class Watcher extends Thread{
      private TV tv;
  
      Watcher(TV tv,String name){
          super(name);
          this.tv=tv;
      }
  
      @Override
      public void run() {
          try {
              watch();
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
      }
  
      public void watch() throws InterruptedException {
          for (int i = 0; i < 10; i++) {
              tv.watch(getName());
          }
      }
  }
  
  //电视
  class TV{
  
      private Show show;    //节目
      private boolean flag=true;    //信号   T:演员表演，观众等待     F:观众观看，演员等待
  
      //表演
      public synchronized void perform(Show show) throws InterruptedException {
          while(!flag){
              wait();    //演员等待
          }
          this.show=show;   //演员表演
          System.out.println("演员上演了ID为 "+show.getId()+" 的节目");
          flag=!flag;
          notifyAll();   //通知观众
      }
  
      //观看
      public synchronized void watch(String name) throws InterruptedException {
          while(flag){
              wait();   //观众等待
          }
          System.out.println(name+" 观众观看了ID为 "+this.show.getId()+" 的节目");     //观众观看
          flag=!flag;
          notifyAll();   //通知演员
      }
  }
  ```

  **结果：**

  <img src=".\Java多线程学习\21.png" alt="image-20210304110830043" style="zoom:80%;" />



# 线程池

由于经常创建和xiao



# 多线程例子

## UDP聊天室

接收线程：

```java
class Receiver implements Runnable{

    private DatagramSocket socket;
    private boolean flag=true;

    public Receiver(DatagramSocket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            receiveMsg();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void receiveMsg() throws IOException {
        while(flag){
            byte[] container=new byte[1024];
            DatagramPacket datagramPacket=new DatagramPacket(container,0,container.length);
            socket.receive(datagramPacket);

            String receiveData=new String(datagramPacket.getData(),0,datagramPacket.getLength());
            System.out.println();
            System.out.println("接收到消息: "+receiveData);
            System.out.print("请输入需要发送的消息:  ");
            if(receiveData.equals("bye")){
                close();
            }
        }
    }

    public void close(){
        flag=false;
    }
}
```

发送线程：

```java
class Sender implements Runnable{

    private DatagramSocket datagramSocket;
    private InetSocketAddress receiverSocket;     //接收者的地址
    private boolean flag=true;

    public Sender(DatagramSocket datagramSocket,InetSocketAddress receiverSocket) {
        this.datagramSocket = datagramSocket;
        this.receiverSocket=receiverSocket;
    }

    @Override
    public void run() {
        try {
            sendMsg();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void sendMsg() throws IOException {
        while(flag){
            System.out.print("请输入需要发送的消息:  ");
            BufferedReader bufferedReader=new BufferedReader(new InputStreamReader(System.in));
            String data=bufferedReader.readLine();
            DatagramPacket datagramPacket=new DatagramPacket(data.getBytes(), 0, data.getBytes().length, receiverSocket);
            datagramSocket.send(datagramPacket);
            if(data.equals("bye")){
                close();
            }
        }

    }

    public void close(){
        flag=false;
    }
}
```

两个客户端：

```java
public class ChatClient {
    public static void main(String[] args) throws SocketException {
        DatagramSocket socket=new DatagramSocket(8888);
        InetSocketAddress receiveAddress=new InetSocketAddress("localhost", 6666);
        Receiver receiver=new Receiver(socket);
        Sender sender=new Sender(socket,receiveAddress);
        new Thread(receiver).start();
        new Thread(sender).start();
    }
}
```

```java
public class ChatClient2 {
    public static void main(String[] args) throws SocketException {
        DatagramSocket socket=new DatagramSocket(6666);
        InetSocketAddress receiveAddress=new InetSocketAddress("localhost", 8888);
        Receiver receiver=new Receiver(socket);
        Sender sender=new Sender(socket,receiveAddress);
        new Thread(receiver).start();
        new Thread(sender).start();
    }
}
```

**结果：**

<img src=".\Java多线程学习\22.png" alt="image-20210305104820681" style="zoom:80%;" />

<img src=".\Java多线程学习\23.png" alt="image-20210305104847020" style="zoom:80%;" />











<br/>

<br/>

参考：

1.[林炳文Evankaka大佬的Java多线程学习（吐血超详细总结）](https://blog.csdn.net/evankaka/article/details/44153709)

2.[[Java锁Synchronized对象锁和类锁区别](https://www.cnblogs.com/owenma/p/8609348.html)

3.[Java对象锁和类锁全面解析（多线程synchronized关键字）](https://cloud.tencent.com/developer/article/1501912)

4.[Java 基础之方法锁、对象锁、类锁](https://www.jianshu.com/p/92b75042c059)

5.[luoweifu的Java中Synchronized的用法](https://blog.csdn.net/luoweifu/article/details/46613015)

