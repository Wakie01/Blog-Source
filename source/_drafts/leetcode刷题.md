---
title: leetcode刷题
comment: true
date: 2021-01-03 15:35:12
tags:
categories:
addrlink:
---

# 贪心算法

## [605. 种花问题](https://leetcode-cn.com/problems/can-place-flowers/)

只要找到0，就判断它前后是否为0

```java
public boolean canPlaceFlowers(int[] flowerbed, int n) {
        if(n>flowerbed.length) return false;
        int num=0;
        for(int i=0;i<flowerbed.length;i++){
            if(flowerbed[i]==0){
                if(i!=0 && i!=flowerbed.length-1){
                    if(flowerbed[i-1]==0 && flowerbed[i+1]==0){
                        flowerbed[i]=1;
                        num++;
                    }
                    continue;
                }
                if(i==0){
                    if(flowerbed.length==1){
                        flowerbed[i]=1;
                        num++;
                    }else if(flowerbed[i+1]==0){
                        flowerbed[i]=1;
                        num++;
                    }
                    continue;
                }
                if(i==flowerbed.length-1 && flowerbed[i-1]==0){
                    flowerbed[i]=1;
                    num++;
                    continue;
                }
            }
        }
        return num>=n? true:false;
    }
```

## [455. 分发饼干](https://leetcode-cn.com/problems/assign-cookies/)

分别对g与s从小到大排序

```java
class Solution {
    public int findContentChildren(int[] g, int[] s) {
        int contentChildren=0;
        Arrays.sort(g);
        Arrays.sort(s);
        int sIndex=0,gIndex=0;
        while(sIndex<s.length && gIndex<g.length){
            if(s[sIndex]>=g[gIndex]){
                contentChildren++;
                sIndex++;
                gIndex++;
            }else {
                sIndex++;
            }
        }
        return contentChildren;
    }
}
```

## [122. 买卖股票的最佳时机 II](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)

把每日的盈利加起来，盈利就加

```java
class Solution {
    public int maxProfit(int[] prices) {
        int profit=0;
        int now=0,futrue=1;
        while(futrue<prices.length){
            if(prices[futrue]>prices[now]){
                profit+=(prices[futrue]-prices[now]);
            }
            futrue++;
            now++;
        }
        return profit;
    }
}
```



## [1716. 计算力扣银行的钱](https://leetcode-cn.com/problems/calculate-money-in-leetcode-bank/)

数学题

```java
class Solution {
    public int totalMoney(int n) {
        int week=1,total=0;
        for(int i=0;i<n;i++){
            if(i>0 && i%7==0){
                week++;
            }
            total+=(i%7+week);
        }
        return total;
    }
}
```



## [1217. 玩筹码](https://leetcode-cn.com/problems/minimum-cost-to-move-chips-to-the-same-position/)

题目有点复杂

因为移动2个位置代价为0，所以奇数间或偶数间的移动不需要代价

所以其实任意两个筹码，

- 若是这两个筹码的位置是同为奇数或同为偶数，它们移到同一位置是不需要代价的
- 若是这两个筹码的位置是一奇一偶，那它们移到同一位置需要1个代价

所以只需统计出奇、偶数的数量，移动数量小一点的就行了

```java
class Solution {
    public int minCostToMoveChips(int[] position) {
        int obb=0,even=0;
        for(int i=0;i<position.length;i++){
            if(position[i]%2==0){
                even++;
            }else{
                obb++;
            }
        }
        return obb>even? even:obb;
    }
}
```



## [860. 柠檬水找零](https://leetcode-cn.com/problems/lemonade-change/)

找钱先找大的

```java
class Solution {
    public boolean lemonadeChange(int[] bills) {
        int five=0,ten=0,twenty=0;
        for(int i=0;i<bills.length;i++){
            if(bills[i]==5){
                five++;
                continue;
            }
            if(bills[i]==10){
                if(five==0){
                    return false;
                }
                five--;
                ten++;
                continue;
            }
            if(bills[i]==20){
                if(ten>0 && five>0){
                    five--;
                    ten--;
                    twenty++;
                    continue;
                }
                if(ten==0 && five>3){
                    five-=3;
                    twenty++;
                    continue;
                }
                return false;
            }
        }
        return true;
    }
}
```

## [392. 判断子序列](https://leetcode-cn.com/problems/is-subsequence/)

有点绕

```java
class Solution {
    public boolean isSubsequence(String s, String t) {
        int i=0;
        for(char c:s.toCharArray()){
            while(i<t.length() && c!=t.charAt(i)) i++;
            if(i++>t.length()) break;
        }
        return i<=t.length();
    }
}
```



# 深度优先搜索

## [100. 相同的树](https://leetcode-cn.com/problems/same-tree/)

递归法

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if(p==null && q!=null || p!=null && q==null){
            return false;
        }
        if(p!=null && q!=null && p.val!=q.val){
            return false;
        }
        if(p==null && q==null){
            return true;
        }
        boolean leftSame=isSameTree(p.left,q.left);
        boolean rightSame=isSameTree(p.right,q.right);
        return leftSame&&rightSame;
    }
}
```

更好的递归代码：

```java
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        //都为空，相同
        if(p==null && q==null) return true;
        //一个为空，一个不为空，不同
        if(p==null || q==null) return false;
        //两个非空，但数值不同，不同
        if(p.val!=q.val) return false;
        
        return isSameTree(p.left,q.left) && isSameTree(p.right,q.right);
    }
}
```



## [257. 二叉树的所有路径](https://leetcode-cn.com/problems/binary-tree-paths/)

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> paths=new ArrayList<>();
        dfs(root,"",paths);
        return paths;

    }

    public void dfs(TreeNode root,String path,List<String> res){
        if(root==null) return ;

        if(root.left==null && root.right==null) {
            res.add(path+root.val);
        }

        dfs(root.left,path+root.val+"->",res);
        dfs(root.right,path+root.val+"->",res);
    }
}
```

## [110. 平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)

- 自上而下，判断每个树节点是否平衡

```java
class Solution {

    public boolean isBalanced(TreeNode root) {
        
        if(root==null) return true;
        return Math.abs(depth(root.left)-depth(root.right))<=1  
            && isBalanced(root.left) 
            && isBalanced(root.right);
    }
	
    
    public int depth(TreeNode node){
        if(node==null) return 0;
        int left=depth(node.left);
        int right=depth(node.right);
        return (left>=right? left:right)+1;
    }

    
}
```

- 自下而上，平衡则继续往上判断是否平衡

```java
class Solution {

    boolean res=true;

    public boolean isBalanced(TreeNode root) {
        
        helper(root);
        return res;
    }

	//
    public int helper(TreeNode root){
        if(root==null) return 0;
        int left=helper(root.left);
        int right=helper(root.right);
        if(Math.abs(left-right)>1) res=false;
        return (left>=right? left:right)+1;
    }
    
}
```



# 树

## 最大高度

```java
public int maxDepth(TreeNode root){
    if(root==null) return 0;
    int left=maxDepth(root.left);
    int right=maxDepth(root.right);
    return (left>=right left:right)+1;
}
```



## LEETCODE中将数组转变为树

```java
public TreeNode initTree(int[] nodes){
    if(nodes==null ||nodes.length==0) return null;
    TreeNode root=new TreeNode(nodes[0]);

    List<TreeNode> list=new ArrayList<>();
    list.add(root);
    int index=0;
    for(int i=1;i<nodes.length;i++){
        TreeNode node=new TreeNode(nodes[i]);
        list.add(node);
        if(i%2==1){   
            list.get(index).left=node;
        }else{
            list.get(index++).right=node;
        }
    }
    return root;
}
```



## 层次遍历

树的层次遍历关键是用队列

```java
public void HierarchyTraver(TreeNode root){
    if(root==null) return;
    Queue<TreeNode> queue=new LinkedList<>();
    queue.add(root);
    while(queue.size()>0){
        TreeNode treeNode=queue.poll();
        System.out.print(treeNode.val+"  ");
        if(treeNode.left!=null) queue.add(treeNode.left);
        if(treeNode.right!=null) queue.add(treeNode.right);
    }
}
```



## [101. 对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/)



```java
class Solution {
    public boolean isSymmetric(TreeNode root) {
        return dfs(root.left,root.right);
    }
	
    public boolean dfs(TreeNode left,TreeNode right){
        if(left==null && right==null) return true;
        if(left==null || right==null) return false;
        if(left.val!=right.val) return false;
        return dfs(left.left,right.right) && dfs(left.right,right.left);
    }
}
```



## [637. 二叉树的层平均值](https://leetcode-cn.com/problems/average-of-levels-in-binary-tree/)

层次遍历的变通

```java
class Solution {
    public List<Double> averageOfLevels(TreeNode root) {
        List<Double> res=new ArrayList<>();
        if(root==null) return res;
        
        List<TreeNode> list=new ArrayList<>();
        list.add(root);
        while(list.size()>0){
            double total=0;
            int size=list.size();
            for(int i=0;i<size;i++){
                total+=list.get(i).val;
            }
            res.add(total/list.size());

            for(int i=0;i<size;i++){
                TreeNode node=list.get(0);
                list.remove(0);
                if(node.left!=null) list.add(node.left);
                if(node.right!=null) list.add(node.right);
            }
        }
        return res;
    }
}
```



## [226. 翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

先序遍历树，每遍历一个结点，就把该结点的左右子结点调换

```java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root==null) return null;
        TreeNode temp=root.left;
        root.left=root.right;
        root.right=temp;
        invertTree(root.left);
        invertTree(root.right);
        return root;
    }
}
```



## [111. 二叉树的最小深度](https://leetcode-cn.com/problems/minimum-depth-of-binary-tree/)

遍历到叶子结点时，判断是否为最小深度

```java
class Solution {
    int depth=0;
    int minDepth=Integer.MAX_VALUE;
    public int minDepth(TreeNode root) {
        if(root==null) return 0;
        getDepth(root);
        return minDepth;
    }

    public void getDepth(TreeNode root){
        depth++;
        //叶子结点
        if(root.left==null && root.right==null){
            if(minDepth>depth) minDepth=depth;
            return ;
        }
        if(root.left!=null) {
            getDepth(root.left);
            depth--;
        }
        if(root.right!=null){
            getDepth(root.right);
            depth--;
        }
    }
}
```





# 排序

## [1491. 去掉最低工资和最高工资后的工资平均值](https://leetcode-cn.com/problems/average-salary-excluding-the-minimum-and-maximum-salary/)

遍历数组，找出最低与最高

```java
class Solution {
    public double average(int[] salary) {
        double total=0,min=salary[0],max=salary[0];
        for(int s:salary){
            if(s<min) min=s;
            if(s>max) max=s;
            total+=s;
        }
        return (total-min-max)/(salary.length-2);
    }
}
```

