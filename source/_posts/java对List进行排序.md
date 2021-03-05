---
title: java对List进行排序
comment: true
date: 2021-01-12 11:22:06
tags:
categories:
addrlink:
---

# 简单的

```java
public class ListSortLearn {
    public static void main(String[] args) {
        List<Double> list=new ArrayList<>();
        list.add(21.211);
        list.add(140.21);
        list.add(13.21);
        list.add(10.20);
        list.add(41.121);
        list.add(14.21);
        list.add(10.221);

        Collections.sort(list);
        System.out.println(list.toString());
    }
}
```

结果：

![img2](D:\blog\source\_posts\java对List进行排序\2.png)





# 复杂的

```java
public class ListSortLearn {
    public static void main(String[] args) {
        List<MenuRecord> menuRecordList=new ArrayList<>();
        menuRecordList.add(new MenuRecord(1,10));
        menuRecordList.add(new MenuRecord(2,4));
        menuRecordList.add(new MenuRecord(3,75));
        menuRecordList.add(new MenuRecord(4,31));
        menuRecordList.add(new MenuRecord(5,8));
        menuRecordList.add(new MenuRecord(6,10));
        menuRecordList.add(new MenuRecord(7,170));
        menuRecordList.add(new MenuRecord(8,210));

        Collections.sort(menuRecordList);
        System.out.println(menuRecordList.toString());
    }
}


class MenuRecord implements Comparable<MenuRecord>{
    private int menuId;
    private int num;

    public MenuRecord() {
    }

    public MenuRecord(int menuId, int num) {
        this.menuId = menuId;
        this.num = num;
    }

    public int getMenuId() {
        return menuId;
    }

    public void setMenuId(int menuId) {
        this.menuId = menuId;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    @Override
    public int compareTo(MenuRecord o) {
        return o.getNum()-this.num;
    }

    @Override
    public String toString() {
        return "("+menuId+","+num+")";
    }
}

```

结果：

![img1](D:\blog\source\_posts\java对List进行排序\1.png)