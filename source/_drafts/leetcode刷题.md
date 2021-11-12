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



## [1710. 卡车上的最大单元数](https://leetcode-cn.com/problems/maximum-units-on-a-truck/)

从大到小排序

```java
class Solution {
    public int maximumUnits(int[][] boxTypes, int truckSize) {
        int max=0;
        for(int i=0;i<boxTypes.length-1;i++){
            for(int j=i+1;j<boxTypes.length;j++){
                if(boxTypes[i][1]<boxTypes[j][1]){
                    int[] temp=boxTypes[i];
                    boxTypes[i]=boxTypes[j];
                    boxTypes[j]=temp;
                }
            }
        }

        for(int i=0;i<boxTypes.length;i++){
            if(boxTypes[i][0]<=truckSize){
                max+=(boxTypes[i][0]*boxTypes[i][1]);
                truckSize-=boxTypes[i][0];
            }else{
                max+=(boxTypes[i][1]*truckSize);
                truckSize=0;
            }
            if(truckSize==0) break;
        }

        return max;

    }
}
```



## [1403. 非递增顺序的最小子序列](https://leetcode-cn.com/problems/minimum-subsequence-in-non-increasing-order/)

```java
class Solution {
    public List<Integer> minSubsequence(int[] nums) {
        List<Integer> res=new ArrayList<>();
        int sum=0;
        int resSum=0;
        Arrays.sort(nums);
        for (int num : nums) {
            sum+=num;
        }
        for(int i=nums.length-1;i>=0;i--){
            resSum+=nums[i];
            sum-=nums[i];
            res.add(nums[i]);
            if(resSum>sum) break;
        }
        return res;
    }
}
```

优化版：

```java
class Solution {
    public List<Integer> minSubsequence(int[] nums) {
        List<Integer> res=new ArrayList<>();
        int sum=0;
        int resSum=0;
        Arrays.sort(nums);
        for (int num : nums) {
            sum+=num;
        }
        int i=nums.length-1;
        while(resSum<=sum/2){
            resSum+=nums[i];
            res.add(nums[i--]);
        }
        return res;
    }
}
```



## [1046. 最后一块石头的重量](https://leetcode-cn.com/problems/last-stone-weight/)

模拟过程：

```java
class Solution {
    public int lastStoneWeight(int[] stones) {
        Arrays.sort(stones);
        int i=stones.length-1;
        while(i>=1){
            int y=stones[i];
            int x=stones[i-1];
            if(y==x && i>2)  i-=2;
            else {
                stones[--i]=y-x;
                Arrays.sort(stones,0,i+1);
            }
        }
        return stones[0];
    }
}
```

变化一下：

```java
class Solution {
    public int lastStoneWeight(int[] stones) {
        Arrays.sort(stones);
        int i=stones.length-1;
        while(i>=1){
            int y=stones[i];
            int x=stones[i-1];
            if(y==x)  i-=2;
            else {
                stones[--i]=y-x;
                Arrays.sort(stones,0,i+1);
            }
        }
        return i==0? stones[0]:0;
    }
}
```

## [1518. 换酒问题](https://leetcode-cn.com/problems/water-bottles/)

```java
class Solution {
    public int numWaterBottles(int numBottles, int numExchange) {
        int emptyBottles=numBottles;
        while(emptyBottles>=numExchange){
            int newBottles=emptyBottles/numExchange;
            emptyBottles=emptyBottles-(newBottles*numExchange)+newBottles;
            numBottles+=newBottles;
        }
        return numBottles;
    }
}
```

## [1827. 最少操作使数组递增](https://leetcode-cn.com/problems/minimum-operations-to-make-the-array-increasing/)

方法：模拟法

```java
class Solution {
    public int minOperations(int[] nums) {
        int operation=0;
        int i=1;
        while(i<nums.length){
            if(nums[i]>nums[i-1]) {
                i++;
                continue;
            }else{
                while(nums[i]<=nums[i-1]) {
                    nums[i]++;
                    operation++;
                }
                i++;
            }
        }
        return operation;
    }
}
```

模拟法的优化：

```java
class Solution {
    public int minOperations(int[] nums) {
        int operation=0;
        int i=1;
        while(i<nums.length){
            while(nums[i]<=nums[i-1]) {
                nums[i]++;
                operation++;
            }
            i++;
        }
        return operation;
    }
}
```

再优化：

```java
class Solution {
    public int minOperations(int[] nums) {
        int operation=0;
        int i=1;
        while(i<nums.length){
            if(nums[i]<=nums[i-1]){
                operation+=(nums[i-1]-nums[i]+1);
                nums[i]=nums[i-1]+1;
            }
            i++;
        }
        return operation;
    }
}
```



## [55. 跳跃游戏](https://leetcode-cn.com/problems/jump-game/)

方法一：贪心+递归（超时）

```java
class Solution {
    private boolean jumpRes=false;
    public boolean canJump(int[] nums) {
        jump(nums,0,nums[0]);
        return jumpRes;
    }

    public void jump(int[] nums,int curIndex,int jumpNum){
        if(curIndex+jumpNum>=nums.length-1) {
            jumpRes=true;
            return ;
        }

        while(!jumpRes && jumpNum>0) {
            if(nums[curIndex+jumpNum]>0) jump(nums,curIndex+jumpNum,nums[curIndex+jumpNum]);
            jumpNum--;
        }

    }
}
```

方法二：暴力法

```java
class Solution {
    public boolean canJump(int[] nums){
        int mostRight=0;   //最远距离
        for(int i=0;i<=mostRight && i<nums.length;i++){
            if(i+nums[i]>mostRight) mostRight=i+nums[i];
            if(mostRight>=nums.length-1) return true;
        }
        return false;
    }
}
```

优化版：

```java
class Solution {
    public boolean canJump(int[] nums){
        int mostRight=0;
        for(int i=0;i<=mostRight;i++){
            if(i+nums[i]>mostRight) mostRight=i+nums[i];
            if(mostRight>=nums.length-1) return true;
        }
        return false;
    }
}
```



## [45. 跳跃游戏 II](https://leetcode-cn.com/problems/jump-game-ii/)

```java
class Solution {
    public int jump(int[] nums) {
        int jumpNum=0;
        int mostRight=0;   //
        int maxJump=0;
        for(int i=0;i<nums.length-1;i++){
            if(nums[i]+i>maxJump) maxJump=nums[i]+i;
            if(i==mostRight){
                mostRight=maxJump;
                jumpNum++;
            }
        }
        return jumpNum;
    }
}
```

## [1833. 雪糕的最大数量](https://leetcode-cn.com/problems/maximum-ice-cream-bars/)

方法：排序+贪心

```java
class Solution {
    public int maxIceCream(int[] costs, int coins) {
        Arrays.sort(costs);
        int num=0;
        for(int cost:costs){
            if(coins>=cost){
                num++;
                coins-=cost;
            }else{
                break;
            }
        }
        return num;
    }
}
```







# 广度优先搜索

## [690. 员工的重要性](https://leetcode-cn.com/problems/employee-importance/)

注意：一个员工最多有一个直系领导，但可以有多个直系下属，这保证了树结点唯一性

方法一：bfs，递归法

```java
/*
// Definition for Employee.
class Employee {
    public int id;
    public int importance;
    public List<Integer> subordinates;
};
*/
class Solution {
    public int getImportance(List<Employee> employees, int id) {
        int sum=0;
        for (Employee employee : employees) {
            if(employee.id==id) {
                sum+=employee.importance;
                for (Integer subE : employee.subordinates) {
                    sum+=getImportance(employees,subE);
                }
                break;
            }
        }
        return sum;
    }
}
```

方法二：迭代，

```java
public int getImportance(List<Employee> employees, int id) {
    int sum=0;
    Set<Integer> set=new HashSet<>();
    for (Employee employee : employees) {
        if(employee.id==id){
            sum+=employee.importance;
            set.addAll(employee.subordinates);
            break;
        }
    }
    while(set.size()>0){
        for (Employee employee : employees) {
            if(set.contains(employee.id)){
                sum+=employee.importance;
                set.addAll(employee.subordinates);
                set.remove(employee.id);
                break;
            }
        }
    }
    return sum;
}
```

方法三：迭代+Map，加快搜索速度

```java
public int getImportance(List<Employee> employees, int id) {
    Map<Integer,Employee> map=new HashMap<>();
    for (Employee employee : employees) {
        map.put(employee.id,employee);
    }

    int sum=map.get(id).importance;
    List<Integer> list=new ArrayList<>();
    list.addAll(map.get(id).subordinates);
    while(list.size()>0){
        Employee employee=map.get(list.get(0));
        sum+=employee.importance;
        list.addAll(employee.subordinates);
        list.remove(0);
    }
    return sum;
}
```



## [279. 完全平方数](https://leetcode-cn.com/problems/perfect-squares/)

方法一：dfs（超时）

```java
class Solution {
    private int minTimes;
    public int numSquares(int n) {
        minTimes=Integer.MAX_VALUE;
        numSquaresDfs(n,0);
        return minTimes;
    }

    public void numSquaresDfs(int remain,int times){
        if(remain==0){
            if(minTimes>times) minTimes=times;
            return;
        }
        
        if(remain<4){
            if(minTimes>times+remain) minTimes=times+remain;
            return ;
        }
        
        int maxSqrt=(int) Math.sqrt(remain);
        for(int i=maxSqrt;i>1;i--){
            numSquaresDfs(remain-i*i, times+1);
        }
    }
}
```

方法二：bfs

```java
class Solution {
    public int numSquares(int n) {
        int time=0;
        Queue<Integer> list=new LinkedList<>();
        list.add(n);
        while(true){
            time++;
            int size=list.size();
            for(int i=0;i<size;i++){
                int num=list.poll();
                int sqrtNum=(int) Math.sqrt(num);
                for(int j=sqrtNum;j>0;j--){
                    int nextTimeNum=num-j*j;
                    if(nextTimeNum==0){
                        return time;
                    }
                    list.add(nextTimeNum);
                }
            }
        }
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

## [494. 目标和](https://leetcode-cn.com/problems/target-sum/)

方法：深度优先遍历

```java
class Solution {

    private int expresNum;
    public int findTargetSumWays(int[] nums, int target) {
        expresNum=0;
        dfs(nums,0,false,target,0);
        dfs(nums,0,true,target,0);
        return expresNum/2;
    }

    /**
    index:数组指针
    symbol: 相加还是相减
    target: 目标值
    res: 线路结果
     */
    public void dfs(int[] nums,int index,boolean symbol,int target,int res){
        if(index==nums.length){
            if(res==target) expresNum++;
            return ;
        }
        
        if(symbol) res+=nums[index];
        else res-=nums[index];

        index++;
        dfs(nums,index,false,target,res);
        dfs(nums,index,true,target,res);
        
    }
}
```

优化版：

```java
class Solution {

    private int expresNum;
    public int findTargetSumWays(int[] nums, int target) {
        expresNum=0;
        dfs(nums,0,false,target);
        dfs(nums,0,true,target);
        return expresNum;
    }

    public void dfs(int[] nums,int index,boolean symbol,int target){
        if(index==nums.length){
            if(0==target && symbol) expresNum++;
            return ;
        }
        
        if(symbol) target-=nums[index++];
        else target+=nums[index++];

        dfs(nums,index,false,target);
        dfs(nums,index,true,target);
        
    }
}
```

再优化：

```java
class Solution {

    private int expresNum;
    public int findTargetSumWays(int[] nums, int target) {
        expresNum=0;
        dfs(nums,target,0);
        return expresNum;
    }

    public void dfs(int[] nums,int target,int index){
        if(index==nums.length){
            if(0==target) expresNum++;
            return ;
        }
        
        dfs(nums,target+nums[index],index+1);
        dfs(nums,target-nums[index],index+1);
    }
}
```



# 树

## 二叉树前序遍历

递归法：

```java
public void preOrderTraver(TreeNode root) {
    if (root == null) return;
    System.out.print(root.val + "  ");
    preOrderTraver(root.left);
    preOrderTraver(root.right);
}
```

迭代法：用到了栈，右结点先入栈，然后左结点再入

```java
public void preOrderTraver2(TreeNode root) {
    Stack<TreeNode> stack=new Stack<>();
    if(root!=null) stack.push(root);
    while(!stack.empty()){
        TreeNode node=stack.pop();
        System.out.print(node.val+"  ");
        if(node.right!=null) stack.push(node.right);
        if(node.left!=null) stack.push(node.left);
    }
}
```



## [589. N 叉树的前序遍历](https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/)

总的来说，与二叉树的前序遍历很相似

递归法：

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/
class Solution {

    private List<Integer> res=new ArrayList<>();

    public List<Integer> preorder(Node root) {
        preOrderHelper(root);
        return res;
    }

    public void preOrderHelper(Node root){
        if(root==null) return ;
        res.add(root.val);
        for(Node node:root.children){
            preOrderHelper(node);
        }
    }
}
```

迭代法：

```java
class Solution {

    public List<Integer> preorder(Node root) {
        List<Integer> res=new ArrayList<>();
        Stack<Node> stack=new Stack<Node>();
        if(root!=null) stack.push(root);
        while(!stack.empty()){
            Node node=stack.pop();
            res.add(node.val);
            for(int i=node.children.size()-1;i>=0;i--){
                stack.push(node.children.get(i));
            }
        }
        return res;
    } 
}
```

## [二叉树中序遍历](https://www.lintcode.com/problem/67/)

递归法：

```java
public void midOrderTraver(TreeNode root){
    if(root==null) return ;
    midOrderTraver(root.left);
    System.out.print(root.val+"  ");
    midOrderTraver(root.right);
}
```

迭代法：

```java
/**
 * Definition of TreeNode:
 * public class TreeNode {
 *     public int val;
 *     public TreeNode left, right;
 *     public TreeNode(int val) {
 *         this.val = val;
 *         this.left = this.right = null;
 *     }
 * }
 */

public class Solution {

    public List<Integer> inorderTraversal(TreeNode root) {
        // write your code here
        List<Integer> list=new ArrayList<>();
        Stack<TreeNode> stack=new Stack<>();
        TreeNode node=root;
        while(node!=null){
            stack.push(node);
            node=node.left;
        }
        while(!stack.empty()){
            node=stack.pop();
            list.add(node.val);
            if(node.right!=null){
                stack.push(node.right);
                node=node.right;
                while(node.left!=null){
                    stack.push(node.left);
                    node=node.left;
                }
            }
        }
        return list;
    }
}
```





## 二叉树后序遍历

递归法：

```java
public void postOrderTraver(TreeNode root){
    if(root==null) return ;
    postOrderTraver(root.left);
    postOrderTraver(root.right);
    System.out.print(root.val+"  ");
}
```

非递归法：

由于后序遍历顺序是左、右、头，反过来就是头、右、左，所以，只需先按头、右、左的顺序遍历，最后反过来就行。这样就跟前序遍历差不多了

```java
public void postOrderTraver2(TreeNode root){
        Stack<Integer> result=new Stack<>();    //结果
        Stack<TreeNode> stack=new Stack<>();
        if(root!=null) stack.push(root);
        while(!stack.empty()){
            TreeNode node=stack.pop();
            result.push(node.val);
            if(node.left!=null) stack.push(node.left);
            if(node.right!=null) stack.push(node.right);
        }
        while(!result.empty()){
            System.out.print(result.pop()+"  ");
        }
    }
```



## [590. N 叉树的后序遍历](https://leetcode-cn.com/problems/n-ary-tree-postorder-traversal/)

递归法：

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
    
    List<Integer> res=new ArrayList<>();

    public List<Integer> postorder(Node root) {
        postorderHelper(root);
        return res;
    }

    public void postorderHelper(Node root){
        if(root==null) return ;
        for(Node node:root.children){
            postorderHelper(node);
        }
        res.add(root.val);
    }
}
```

迭代法：

```java
class Solution {
    
    public List<Integer> postorder(Node root) {
        List<Integer> res=new ArrayList<>();
        Stack<Node> stack=new Stack<>();
        if(root!=null) stack.push(root);
        while(!stack.empty()){
            Node node=stack.pop();
            res.add(0,node.val);
            for(int i=0;i<node.children.size();i++){
                stack.push(node.children.get(i));
            }
        }
        return res;
    }
}
```






## [104. 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/)

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



## [102. 二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)

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
    public List<List<Integer>> levelOrder(TreeNode root) {
        
        List<List<Integer>> res=new ArrayList<>();

        if(root==null) return res;

        Queue<TreeNode> queue=new LinkedList<>();
        queue.add(root);
        
        while(queue.size()>0){
            int size=queue.size();
            List<Integer> list=new ArrayList<>();
            while(size>0){
                TreeNode node=queue.poll();
                list.add(node.val);
                if(node.left!=null) queue.add(node.left);
                if(node.right!=null) queue.add(node.right);
                --size;
            }
            res.add(list);
        }
        return res;
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



## [559. N 叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree/)

跟二叉树的最小深度类似

```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
    
    private int depth=0;
    private int maxDepth=0;
    
    public int maxDepth(Node root) {
        if(root==null) return 0;
        findDepth(root);
        return maxDepth;
    }

    public void findDepth(Node root){
        depth++;
        //叶子结点
        if(root.children==null || root.children.size()==0){
            if(depth>maxDepth) maxDepth=depth;
            return ;    
        }
        for(int i=0;i<root.children.size();i++){
            findDepth(root.children.get(i));
            depth--;
        } 
    }
}
```



## [112. 二叉树路径总和](https://leetcode-cn.com/problems/path-sum/)

思路一：暴力法，遍历所有叶子结点

```java
class Solution {
    
    private int sum=0;
    private boolean res=false;

    public boolean hasPathSum(TreeNode root, int targetSum) {
        if(root==null) return false;
        helper(root,targetSum);
        return res;
    }

    public void helper(TreeNode root,int targetSum){
        sum+=root.val;
        if(root.left==null && root.right==null){
            if(sum==targetSum) res=true;
            return ;
        }
        if(!res && root.left!=null){    //如果已为T，就不用再找了
            helper(root.left,targetSum);
            sum-=root.left.val;
        }
        if(!res && root.right!=null){   //如果已为T，就不用再找了
            helper(root.right,targetSum);
            sum-=root.right.val;
        }
    }
}
```

优化版：

```java
private boolean hasPathSum(TreeNode root,int targetSum){
    if(root==null) return false;
    if(root.left==null && root.right==null) return root.val==targetSum;
    return hasPathSum(root.left, targetSum-root.val)||hasPathSum(root.right,targetSum-root.val);
}
```

## [113. 路径总和 II](https://leetcode-cn.com/problems/path-sum-ii/)

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
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> res=new ArrayList<>();
        if(root==null) return res;
        List<Integer> path=new ArrayList<>();
        path.add(root.val);
        if(root.left!=null){
            traver(res,path,root.left,targetSum-root.val);
        }
        if(root.right!=null){
            traver(res,path,root.right,targetSum-root.val);
        }

        if(root.left==null && root.right==null){
            if(root.val==targetSum){
                res.add(path);
            }
        }

        return res;
    }

    public void traver(List<List<Integer>> res,List<Integer> path,TreeNode node,int remain){
        List<Integer> newPath=new ArrayList<>(path);
        newPath.add(node.val);
        if(node.left!=null){
            traver(res,newPath,node.left,remain-node.val);
        }
        if(node.right!=null){
            traver(res,newPath,node.right,remain-node.val);
        }

        if(node.left==null && node.right==null){
            if(remain==node.val){
                res.add(newPath);
            }
            return ;
        }
    }
}
```

优化版：

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

    List<List<Integer>> ret = new LinkedList<List<Integer>>();
    Deque<Integer> path = new LinkedList<Integer>();

    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        dfs(root, targetSum);
        return ret;
    }

    public void dfs(TreeNode root, int targetSum) {
        if (root == null) {
            return;
        }
        path.offerLast(root.val);
        targetSum -= root.val;
        if (root.left == null && root.right == null && targetSum == 0) {
            ret.add(new LinkedList<Integer>(path));
        }
        dfs(root.left, targetSum);
        dfs(root.right, targetSum);
        path.pollLast();
    }

}
```

## [437. 路径总和 III](https://leetcode-cn.com/problems/path-sum-iii/)

方法：对每个结点都求路径总和

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
    
    private int res=0;
    
    public int pathSum(TreeNode root, int targetSum) {
        traver(root,targetSum);
        return res;
    }

    public void traver(TreeNode node,int targetSum){
        if(node==null) return;

        computePathSum(node,targetSum);

        traver(node.left,targetSum);
        traver(node.right,targetSum);
    }

    public void computePathSum(TreeNode node,int target){
        target-=node.val;
        if(target==0){
            res++;
        }

        if(node.left!=null) computePathSum(node.left,target);
        if(node.right!=null) computePathSum(node.right,target);
    }

}
```







## [108. 将有序数组转换为二叉搜索树](https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/)

二分查找法

```java
class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        if(nums==null || nums.length==0) return null;
        return findHead(nums, 0, nums.length - 1);
    }

    public TreeNode findHead(int[] nums,int start,int end){
        if(start>end) return null;
        int mid=(start+end)/2;    //比如:int start=1,end=4;  则(start+end)/2=2
        TreeNode root=new TreeNode(nums[mid]);
        root.left=findHead(nums, start, mid - 1);
        root.right=findHead(nums, mid + 1, end);
        return root;
    }
}
```



## [700. 二叉搜索树中的搜索](https://leetcode-cn.com/problems/search-in-a-binary-search-tree/)

```java
class Solution {
    public TreeNode searchBST(TreeNode root, int val) {
        if(root==null) return null;
        if(root.val==val) return root;
        return root.val<val? searchBST(root.right,val) : searchBST(root.left,val);
    }
}
```



## [501. 二叉搜索树中的众数](https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/)

二叉搜索树的中序遍历是从小到大排列的，然后在从中运行双指针思想找找众数

```java
class Solution {
    
    List<Integer> midOrder=new ArrayList<>();

    public int[] findMode(TreeNode root) {
        if(root==null) return new int[]{};
        midOrderTraver(root);

        int pre=0;
        int cur=pre;
        int num=0;
        int maxNum=0;
        List<Integer> resList=new ArrayList<>();
        
        while(cur<midOrder.size()){
            if(midOrder.get(pre).equals(midOrder.get(cur))){
                num++;
                if(num==maxNum){
                    resList.add(midOrder.get(pre));
                }else if(num>maxNum){
                    if(maxNum>0){
                        resList.removeAll(resList);
                    }
                    resList.add(midOrder.get(pre));
                    maxNum=num;
                }
                cur++;
            }else{
                pre=cur;
                num=0;
            }
        }

        int[] res=new int[resList.size()];
        for(int i=0;i<resList.size();i++){
            res[i]=resList.get(i);
        }
        return res;
    }

    public void midOrderTraver(TreeNode root){
        if(root==null) return ;
        midOrderTraver(root.left);
        midOrder.add(root.val);
        midOrderTraver(root.right);
    }
}
```



## [938. 二叉搜索树的范围和](https://leetcode-cn.com/problems/range-sum-of-bst/)

法一：中序遍历

```java
class Solution {
    
    List<Integer> midOrder=new ArrayList<>();

    public int rangeSumBST(TreeNode root, int low, int high) {
        midOrderTraver(root);
        int res=0;
        for(int i=0;i<midOrder.size();i++){
            if(midOrder.get(i)<low){
                continue;
            }else if(midOrder.get(i)<=high){
                res+=midOrder.get(i);
            }else {
                break;
            }
        }
        return res;
    }

    public void midOrderTraver(TreeNode root){
        if(root==null) return ;
        midOrderTraver(root.left);
        midOrder.add(root.val);
        midOrderTraver(root.right);
    }
}
```

法二：递归法

```java
 
class Solution {
    
    public int rangeSumBST(TreeNode root, int low, int high) {
        if(root==null) return 0;
        if(root.val<low){
            return rangeSumBST(root.right,low,high);
        }else if(root.val<=high){
            return root.val+rangeSumBST(root.left,low,high)+rangeSumBST(root.right,low,high);
        }else {
            return rangeSumBST(root.left,low,high);
        }
    }
}
```



## [965. 单值二叉树](https://leetcode-cn.com/problems/univalued-binary-tree/)

法一：递归法

```java
class Solution {
    public boolean isUnivalTree(TreeNode root) {
        if(root==null) return true;
        if(root.left!=null && root.val!=root.left.val) return false;
        if(root.right!=null && root.val!=root.right.val) return false;
        return true && isUnivalTree(root.left) && isUnivalTree(root.right); 

    }
}
```

法二：递归暴力法

```java
class Solution {
    List<Integer> nodeList=new ArrayList<>();

    public boolean isUnivalTree(TreeNode root) {
        preOrderTraver(root);
        for(int i=0;i<nodeList.size();i++){
            if(!nodeList.get(0).equals(nodeList.get(i))) return false;
        }
        return true;
    }

    public void preOrderTraver(TreeNode root){
        if(root==null) return ;
        nodeList.add(root.val);
        preOrderTraver(root.left);
        preOrderTraver(root.right);
    }
}
```

法三：迭代法

```java
class Solution {
    public boolean isUnivalTree(TreeNode root) {
        Stack<TreeNode> stack=new Stack<>();
        int rootVal=0;
        if(root!=null){
            stack.push(root);
            rootVal=root.val;
        } 
        while(!stack.empty()){
            TreeNode node = stack.pop();
            if(node.val!=rootVal) return false;
            if(node.right!=null) stack.push(node.right);
            if(node.left!=null) stack.push(node.left);
        }
        return true;
    }
}
```

## [897. 递增顺序搜索树](https://leetcode-cn.com/problems/increasing-order-search-tree/)

方法一：非递归法

```java
class Solution {

    public TreeNode increasingBST(TreeNode root) {
        TreeNode head=null;
        TreeNode curNode=null;
        TreeNode node=root;
        Stack<TreeNode> stack=new Stack<>();
        while(node!=null){
            stack.push(node);
            node=node.left;
        }
        while(!stack.isEmpty()){
            node=stack.pop();
            if(head==null){
                head=new TreeNode(node.val);
                curNode=head;
            } 
            else{
                TreeNode resNode=new TreeNode(node.val);
                curNode.right=resNode;
                curNode=resNode;
            }
            if(node.right!=null){
                stack.push(node.right);
                node=node.right;
                while(node.left!=null){
                    stack.push(node.left);
                    node=node.left;
                }
            }
        }

        return head;
    }   
}
```



方法二：递归法

```java
class Solution {

    private TreeNode head=null;
    private TreeNode curNode=null;

    public TreeNode increasingBST(TreeNode root) {
        midOrderTraver(root);
        return head;
    }

    private void midOrderTraver(TreeNode node){
        if(node==null) return ;
        midOrderTraver(node.left);
        if(head==null){
            head=new TreeNode(node.val);
            curNode=head;
        }else{
            TreeNode resNode=new TreeNode(node.val);
            curNode.right=resNode;
            curNode=resNode;
        }
        midOrderTraver(node.right);
    }    
}
```



## [404. 左叶子之和](https://leetcode-cn.com/problems/sum-of-left-leaves/)

```java
class Solution {

    private int res;
    public int sumOfLeftLeaves(TreeNode root) {
        res=0;
        preOrderTraver(root,false);
        return res;
    }

    public void preOrderTraver(TreeNode node,boolean left){

        if(node.left==null && node.right==null){
            if(left) res+=node.val;
            return ;
        }
        if(node.left!=null) preOrderTraver(node.left,true);
        if(node.right!=null) preOrderTraver(node.right,false);
        
    }
}
```

## [872. 叶子相似的树](https://leetcode-cn.com/problems/leaf-similar-trees/)

方法：前序遍历获取叶子节点序列，然后比较

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
    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        List<Integer> leaves1=new ArrayList<>();
        List<Integer> leaves2=new ArrayList<>();
        if(root1!=null) preOrderHelper(leaves1,root1);
        if(root2!=null) preOrderHelper(leaves2,root2);
        if(leaves1.size()==leaves2.size()){
            for(int i=0;i<leaves1.size();i++){
                if(leaves1.get(i)!=leaves2.get(i)) return false;
            }
            return true;
        }else
            return false;
    }

    public void preOrderHelper(List<Integer> leaves,TreeNode node){
        if(node.left==null && node.right==null) {
            leaves.add(node.val);
            return ;
        }

        if(node.left!=null) preOrderHelper(leaves,node.left);
        if(node.right!=null) preOrderHelper(leaves,node.right);

    }
}
```

优化内存空间：减少一个叶子节点序列的空间

```java
class Solution {

    private int i;
    private boolean res;

    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        List<Integer> leaves1=new ArrayList<>();
        if(root1!=null) preOrderHelper(leaves1,root1);

        if(root2!=null){
            i=0;
            res=true;
            preOrderCompare(leaves1,root2);
            return res && i==leaves1.size();
        }else{
            return leaves1.size()==0;
        }        
    }

    public void preOrderHelper(List<Integer> leaves,TreeNode node){
        if(node.left==null && node.right==null) {
            leaves.add(node.val);
            return ;
        }

        if(node.left!=null) preOrderHelper(leaves,node.left);
        if(node.right!=null) preOrderHelper(leaves,node.right);
    }

    //将已有的叶子序列进行比较
    public void preOrderCompare(List<Integer> leaves,TreeNode node){
        if(node.left==null && node.right==null) {
            if(i>=leaves.size()) res=false;
            else res &= leaves.get(i++)==node.val;
        }

        if(node.left!=null) preOrderCompare(leaves,node.left);
        if(node.right!=null) preOrderCompare(leaves,node.right);
    }
}
```



## [993. 二叉树的堂兄弟节点](https://leetcode-cn.com/problems/cousins-in-binary-tree/)

方法：层次遍历

```java
class Solution {
    public boolean isCousins(TreeNode root, int x, int y) {
        List<TreeNode> list=new ArrayList<>();
        short finish=0;

        if(!checkIsChilds(root,x,y)) list.add(root);
        while(list.size()>0 && finish==0){
            int size=list.size();
            int i=0;
            while(i<size){
                TreeNode node=list.get(0);
                if(node.val==x || node.val==y) {
                    finish++;
                }
                if(finish==0){
                    if(node.left!=null && !checkIsChilds(node.left,x,y)) list.add(node.left);
                    if(node.right!=null && !checkIsChilds(node.right,x,y)) list.add(node.right);
                }
                list.remove(0);
                i++;
            }

        }
        return finish==2;
    }

    public boolean checkIsChilds(TreeNode root,int x,int y){
        short childs=0;
        if(root.left!=null && root.right!=null){
            if(root.left.val==x || root.left.val==y) childs++;
            if(root.right.val==x || root.right.val==y) childs++;
        }
        return childs==2;
    }
}
```

代码优化：

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
    public boolean isCousins(TreeNode root, int x, int y) {
        List<TreeNode> list=new ArrayList<>();
        short finish=0;

        if(!checkIsChilds(root,x,y)) list.add(root);
        while(list.size()>0 && finish==0){
            int size=list.size();
            while(size>0){
                TreeNode node=list.get(0);
                if(node.val==x || node.val==y) {
                    ++finish;
                }
                if(finish==0){
                    if(node.left!=null && !checkIsChilds(node.left,x,y)) list.add(node.left);
                    if(node.right!=null && !checkIsChilds(node.right,x,y)) list.add(node.right);
                }
                list.remove(0);
                --size;
            }

        }
        return finish==2;
    }

    public boolean checkIsChilds(TreeNode root,int x,int y){
        short childs=0;
        if(root.left!=null && root.right!=null){
            if(root.left.val==x || root.left.val==y) ++childs;
            if(root.right.val==x || root.right.val==y) ++childs;
        }
        return childs==2;
    }
}
```



## [654. 最大二叉树](https://leetcode-cn.com/problems/maximum-binary-tree/)

方法：递归

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
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        return helper(nums,0,nums.length);
    }

    public TreeNode helper(int[] nums,int start,int end){
        int max=nums[start];
        int maxIndex=start;
        for(int i=start+1;i<end;i++){
            if(nums[i]>max) {
                max=nums[i];
                maxIndex=i;
            }
        }
        TreeNode head=new TreeNode(max);
        if(start<maxIndex) head.left=helper(nums,start,maxIndex);
        if(maxIndex+1<end) head.right=helper(nums,maxIndex+1,end);
        return head;
    }
}
```



## [96. 不同的二叉搜索树](https://leetcode-cn.com/problems/unique-binary-search-trees/)

方法一：公式

![image-20210705192440891](D:\blog\source\_drafts\leetcode刷题\6.png)

```java
class Solution {
    public int numTrees(int n) {
        if(n==0) return 0;
        long num=1;
        for(int i=1;i<n;i++){
            num=2*(2*i+1)*num/(i+2);
        }
        return (int) num;
    }
}
```

方法二：动态规划

![image-20210705195051246](D:\blog\source\_drafts\leetcode刷题\7.png)

```java
class Solution {
    public int numTrees(int n) {
        int[] G=new int[n+1];
        G[0]=1;
        G[1]=1;
        for(int i=2;i<=n;i++){
            for(int j=1;j<=i;j++){
                G[i]+=(G[j-1]*G[i-j]);
            }
        }
        return G[n];
    }
}
```

## [1104. 二叉树寻路](https://leetcode-cn.com/problems/path-in-zigzag-labelled-binary-tree/)

方法：数学

先思考顺着来的，顺着来的话，直接除2就可以得到父节点。

然后再思考逆着来的，逆着来的话，也是直接除2，只不过除完2之后还要倒转一下该层的结点，画个图就知道了

这里还用到一个对数公式：
$$
log _a b=\frac {log _c b} {log _c a}
$$
这又重新回顾了一下数学

```java
class Solution {
    public List<Integer> pathInZigZagTree(int label) {
        List<Integer> res=new ArrayList<>();
        res.add(label);
        while(label>1){
            int falseVal=label/2;
            label=reverseNum(falseVal);
            res.add(0,label);
        }
        return res;
    }

    //反转
    public int reverseNum(int falseVal){
        if(falseVal==1) return 1;
        int level= (int) (Math.log(falseVal)/Math.log(2));
        int min= (int) Math.pow(2,level);
        int max=(int) Math.pow(2,level+1)-1;
        int interval=max-falseVal;
        return min+interval;
    }
}
```



## [863. 二叉树中所有距离为 K 的结点](https://leetcode-cn.com/problems/all-nodes-distance-k-in-binary-tree/)

```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<Integer, List<Integer>> map = new HashMap<>();
        traver(root, map);

        List<Integer> res = new ArrayList<>();

        //对结点关联图进行深度遍历
        Set<Integer> ignore = new HashSet<>();
        ignore.add(target.val);
        dfs(target.val, map, res, ignore, 0, k);

        return res;
    }

    /**
     * 深度优先遍历
     *
     * @param node     遍历到哪个点
     * @param map      结点关联图
     * @param res      结果
     * @param ignore   需要忽略的点
     * @param distance 已走的距离
     * @param k        要走的距离
     */
    public void dfs(Integer node, 
                    Map<Integer, List<Integer>> map, 
                    List<Integer> res, 
                    Set<Integer> ignore, 
                    int distance, int k) {
        if (distance == k) {
            res.add(node);
            return;
        }
        List<Integer> childs = map.get(node);
        if (childs == null) return;
        for (Integer child : childs) {
            //对结点进行排除
            if (ignore.contains(child)) continue;
            ignore.add(child);
            dfs(child, map, res, ignore, distance + 1, k);
        }
    }

    // 构建结点关联图
    public void traver(TreeNode node, Map<Integer, List<Integer>> map) {
        if (node == null) {
            return;
        }
        //关联的结点
        List<Integer> nodeList = map.getOrDefault(node.val, new ArrayList<>());
        if (node.left != null) {
            nodeList.add(node.left.val);
            List<Integer> leftNodeList = map.getOrDefault(node.left.val, new ArrayList<>());
            leftNodeList.add(node.val);
            map.put(node.left.val, leftNodeList);
            traver(node.left, map);
        }
        if (node.right != null) {
            nodeList.add(node.right.val);
            List<Integer> rightNodeList = map.getOrDefault(node.right.val, new ArrayList<>());
            rightNodeList.add(node.val);
            map.put(node.right.val, rightNodeList);
            traver(node.right, map);
        }
        map.put(node.val, nodeList);
    }
}
```

## [671. 二叉树中第二小的节点](https://leetcode-cn.com/problems/second-minimum-node-in-a-binary-tree/)

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

    private int ans=-1;

    public int findSecondMinimumValue(TreeNode root) {
        traver(root,root.val);
        return this.ans;
    }


    public void traver(TreeNode node,int min){
        if(node==null) return ;
        if(node.left==null) return ;
        
        int minChild=Math.max(node.left.val,node.right.val);
        if(minChild!=min){
            if(this.ans==-1) this.ans=minChild;
            else this.ans=Math.min(this.ans,minChild);
        }
        traver(node.left,min);
        traver(node.right,min);
    }
}
```







# 排序

| 排序算法 | 平均时间复杂度 | 空间复杂度 | 稳定性 |
| -------- | -------------- | ---------- | ------ |
| 冒泡排序 | O(n^2)         | O(1)       | 稳定   |
| 选择排序 | O(n^2)         | O(1)       | 不稳定 |
| 插入排序 | O(n^2)         | O(1)       | 稳定   |
| 快速排序 | O(n*logn)      | O(n*logn)  | 不稳定 |
| 归并排序 | O(n*logn)      | O(1)       | 稳定   |
| 堆排序   | O(n*logn)      | O(1)       | 不稳定 |
| 希尔排序 | O(n*logn)      | O(n*logn)  | 不稳定 |
| 计数排序 | O(n+k)         | O(n+k)     | 稳定   |
| 桶排序   | O(n+k)         | O(n+k)     | 稳定   |
| 基数排序 | O(n*k)         | O(n+k)     | 稳定   |



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



## 快速排序

```java
public int[] quickSort(int[] A){
    if(A==null) return new int[]{};
    quickSortHelper(A,0,A.length-1);
    return A;
}

public void quickSortHelper(int[] A,int start,int end){
    if(start>=end) return ;
    int temp=A[start];
    int i=start,j=end;
    while(i<j){
        while(i<j && A[j]>temp) j--;
        if(i<j){
            A[i++]=A[j];
        }
        while (i<j && A[i]<temp) i++;
        if(i<j){
            A[j--]=A[i];
        }
    }
    A[i]=temp;
    quickSortHelper(A,start,i-1);
    quickSortHelper(A,i+1, end);
}
```



## 冒泡排序

```java
public void bubbleSort(int[] nums){
    for(int i=0;i<nums.length-1;i++){
        for(int j=0;j<nums.length-1-i;j++){
            if(nums[j]>nums[j+1]){
                int temp=nums[j];
                nums[j]=nums[j+1];
                nums[j+1]=temp;
            }
        }
    }
}
```

## 归并排序

```java
class Solution {
    public int[] sortArray(int[] nums) {
        return cut(nums);
    }

    /** 分，将一个数组拆分为两个 */
    public int[] cut(int[] nums){
        if(nums.length==1){
            return nums;
        }
        if(nums.length==2){
            if(nums[0]>nums[1]){
                int temp=nums[0];
                nums[0]=nums[1];
                nums[1]=temp;
            }
            return nums;
        }
        int[] left = cut(Arrays.copyOfRange(nums, 0, nums.length / 2));
        int[] right = cut(Arrays.copyOfRange(nums, nums.length / 2, nums.length));
        return merge(left,right);
    }

    /** 合，将两个排序的数据合并为一个排序的数组 */
    public int[] merge(int[] nums1,int[] nums2){
        int[] res=new int[nums1.length+nums2.length];
        int i=0,j=0,index=0;
        while(i<nums1.length && j<nums2.length){
            if(nums1[i]<nums2[j]){
                res[index++]=nums1[i++];
            }else{
                res[index++]=nums2[j++];
            }
        }
        while(i<nums1.length){
            res[index++]=nums1[i++];
        }
        while(j<nums2.length){
            res[index++]=nums2[j++];
        }
        return res;
    }
}
```

优化版：

```java
class Solution {
    public int[] sortArray(int[] nums) {
        /** 分，将一个数组拆分为两个 */
        if(nums.length==1){
            return nums;
        }
        if(nums.length==2){
            if(nums[0]>nums[1]){
                int temp=nums[0];
                nums[0]=nums[1];
                nums[1]=temp;
            }
            return nums;
        }
        int[] left = sortArray(Arrays.copyOfRange(nums, 0, nums.length / 2));
        int[] right = sortArray(Arrays.copyOfRange(nums, nums.length / 2, nums.length));
        return merge(left,right);
    }

    
    /** 合，将两个排序的数据合并为一个排序的数组 */
    public int[] merge(int[] nums1,int[] nums2){
        int[] res=new int[nums1.length+nums2.length];
        int i=0,j=0,index=0;
        while(i<nums1.length && j<nums2.length){
            if(nums1[i]<nums2[j]){
                res[index++]=nums1[i++];
            }else{
                res[index++]=nums2[j++];
            }
        }
        while(i<nums1.length){
            res[index++]=nums1[i++];
        }
        while(j<nums2.length){
            res[index++]=nums2[j++];
        }
        return res;
    }
}
```







## [1337. 矩阵中战斗力最弱的 K 行](https://leetcode-cn.com/problems/the-k-weakest-rows-in-a-matrix/)

```java
class Solution {
    public int[] kWeakestRows(int[][] mat, int k) {
        //0: 存战斗力    1：存位置
        int[][] army=new int[mat.length][2];
        for(int i=0;i<mat.length;i++){
            int j=0;
            while(j<mat[i].length && mat[i][j]==1) j++;
            army[i][0]=j;
            army[i][1]=i;
        }

        bubbleSort(army);

        int[] res=new int[k];
        for(int i=0;i<k;i++){
            res[i]=army[i][1];
        }
        return res;
    }

    
    public void bubbleSort(int[][] array){
        for(int i=0;i<array.length;i++){
            for(int j=0;j<array.length-1;j++){
                if(array[j][0]>array[j+1][0]){
                    int[] temp=array[j];
                    array[j]=array[j+1];
                    array[j+1]=temp;
                }
            }
        }
    }
}
```





## 二分法排序



## [976. 三角形的最大周长](https://leetcode-cn.com/problems/largest-perimeter-triangle/)

```java
class Solution {
    public int largestPerimeter(int[] A) {
        if(A==null || A.length<3) return 0;
        A=bubbleSort(A);
        for(int i=0;i<A.length-2;i++){
            if(isTriangle(A[i],A[i+1],A[i+2])){
                return A[i]+A[i+1]+A[i+2];
            }
        }
        return 0;
    }

    public boolean isTriangle(int a,int b,int c){
        return a+b>c && a+c>b && b+c>a;
    }
	
    //冒泡排序
    public int[] bubbleSort(int[] A){
        for(int i=0;i<A.length-1;i++){
            for(int j=i+1;j<A.length;j++){
                if(A[i]<A[j]){
                    int temp=A[i];
                    A[i]=A[j];
                    A[j]=temp;
                }
            }
        }
        return A;
    }
}
```

## [1451. 重新排列句子中的单词](https://leetcode-cn.com/problems/rearrange-words-in-a-sentence/)

冒泡排序

```java
class Solution {
    public String arrangeWords(String text) {
        StringBuilder stringBuilder=new StringBuilder();
        String[] strs = text.toLowerCase().split(" ");

        for(int i=0;i<strs.length-1;i++){
            for(int j=0;j<strs.length-1-i;j++){
                if(strs[j].length()>strs[j+1].length()){
                    String s=strs[j];
                    strs[j]=strs[j+1];
                    strs[j+1]=s;
                }
            }
        }
        for (int i = 0; i < strs.length; i++) {
            if(i==0){
                stringBuilder.append(String.valueOf(strs[0].charAt(0)).toUpperCase()+strs[i].substring(1));
            }else{
                stringBuilder.append(strs[i]);
            }
            if(i!=strs.length-1) stringBuilder.append(" ");
        }
        return stringBuilder.toString();
    }
}
```

代码优化版：

```java
class Solution {
    public String arrangeWords(String text) {
        String[] strs = text.toLowerCase().split(" ");

        for(int i=0;i<strs.length-1;i++){
            for(int j=0;j<strs.length-1-i;j++){
                if(strs[j].length()>strs[j+1].length()){
                    String s=strs[j];
                    strs[j]=strs[j+1];
                    strs[j+1]=s;
                }
            }
        }
        strs[0]=(char)(strs[0].charAt(0)-32)+strs[0].substring(1);
        return String.join(" ",strs);
    }
}
```





# 双指针

## 找众数

给出一个数组，找出出现次数最多的数，假设这个最多的数是唯一的

```java
public Integer doFindMode(int[] nums) {
    if (nums == null) return null;
    Arrays.sort(nums);
    int pre = 0;     //比较的数
    int cur = pre+1; //当前指针
    int num = 1;     //num[pre]出现的次数
    int maxNum=nums[pre];    //众数
    int max = 1;     //众数出现的次数
    while (cur < nums.length) {
        //如果前一个数与后一个数相同
        if (nums[pre] == nums[cur]) {
            if (++ num > max) {
                maxNum = nums[pre];
                max = num;
            }
            cur++;
        } else {
            num = 0;
            pre = cur;
        }
    }
    return maxNum;
}
```

若是这个众数不唯一，然后返回所有众数的话：

```java
 public int[] doFindModes(int[] nums) {
     if (nums == null) return new int[]{};
     Arrays.sort(nums);
     List<Integer> resList = new ArrayList<>();

     int pre = 0;   //
     int cur = pre;
     int num = 0;    //nums[pre]出现的次数
     int maxNum = 0;     //众数出现的次数

     while (cur < nums.length) {
         if (nums[pre] == nums[cur]) {
             num++;
             if (num == maxNum) {
                 resList.add(nums[pre]);
             } else if (num > maxNum) {
                 if(maxNum>0){
                     resList.removeAll(resList);
                 }
                 resList.add(nums[pre]);
                 maxNum = num;
             }
             cur++;
         } else {
             pre = cur;
             num = 0;
         }
     }
     int[] res = new int[resList.size()];
     for (int i = 0; i < resList.size(); i++) {
         res[i] = resList.get(i);
     }
     return res;
 }
```



## [88. 合并两个有序数组](https://leetcode-cn.com/problems/merge-sorted-array/)

从后面开始

```java
public void merge(int[] nums1, int m, int[] nums2, int n) {
    int index=nums1.length-1;
    m--;
    n--;
    while(m>=0 && n>=0){
        if(nums1[m]>=nums2[n]){
            nums1[index--]=nums1[m--];
        }else{
            nums1[index--]=nums2[n--];
        }
    }
    while(m>=0){
        nums1[index--]=nums1[m--];
    }
    while(n>=0){
        nums1[index--]=nums2[n--];
    }
}
```

```java
public void merge(int[] A, int m, int[] B, int n) {
        int index=m+n-1;   //插入元素的位置
        m--;
        n--;
        while(index>=0){
            if(m>=0 && n>=0){
                if(A[m]>B[n]) A[index--]=A[m--];
                else A[index--]=B[n--];
            }else if(m>=0){
                A[index--]=A[m--];
            }else{
                A[index--]=B[n--];
            }
        }
    }
```



## 对两个数组找交集

```java
public List<Integer> findIntersection(int[] A,int[] B){
    List<Integer> intersection=new ArrayList<>();
    if(A==null ||B==null) return intersection;
    Arrays.sort(A);
    Arrays.sort(B);
    int i=0;   //A指针
    int j=0;   //B指针
    while(i<A.length && j<B.length){
        if(A[i]==B[j]){
            intersection.add(A[i]);
            i++;
            j++;
        }else if(A[i]<B[j]){
            i++;
        }else{
            j++;
        }
    }
    return intersection;
}
```



## [349. 两个数组的交集](https://leetcode-cn.com/problems/intersection-of-two-arrays/)

```java
class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        int i=0; 
        int j=0;
        int[] res;
        List<Integer> resList=new ArrayList<>();
        if(nums1!=null) Arrays.sort(nums1);
        if(nums2!=null) Arrays.sort(nums2);
        while(i<nums1.length && j<nums2.length){
            if(nums1[i]==nums2[j]){
                //判断是否重复
                if(i==0) resList.add(nums1[i]);   
                else if(nums1[i]!=nums1[i-1]) resList.add(nums1[i]);
                i++;
                j++;
            }else if(nums1[i]<nums2[j]){
                i++;
            }else{
                j++;
            }
        }
        res=new int[resList.size()];
        for(i=0;i<resList.size();i++){
            res[i]=resList.get(i);
        }
        return res;

    }
}
```



## [350. 两个数组的交集 II](https://leetcode-cn.com/problems/intersection-of-two-arrays-ii/)

方法一：排序+双指针

```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        Arrays.sort(nums1);
        Arrays.sort(nums2);
        List<Integer> resList=new ArrayList<>();
        int i=0;
        int j=0;
        while(i<nums1.length && j<nums2.length){
            if(nums1[i]==nums2[j]){
                resList.add(nums1[i]);
                i++;
                j++;
            }else if(nums1[i]<nums2[j]){
                i++;
            }else{
                j++;
            }
        }
        int[] res=new int[resList.size()];
        for(i=0;i<res.length;i++){
            res[i]=resList.get(i);
        }
        return res;
    }
}
```

方法二：哈希

```java
class Solution {
    public int[] intersect(int[] nums1, int[] nums2) {
        if(nums1.length>nums2.length) return intersect(nums2,nums1);
        
        Map<Integer,Integer> hashMap=new HashMap<>();
        int[] res=new int[nums1.length];
        int index=0;  //res长度指针
        int i;
        for(i=0;i<nums1.length;i++){
            if(hashMap.containsKey(nums1[i])){
                hashMap.replace(nums1[i],hashMap.get(nums1[i])+1);
            }else{
                hashMap.put(nums1[i],1);
            }
        }
        
        for(i=0;i<nums2.length;i++){
            if(hashMap.containsKey(nums2[i])){
                res[index++]=nums2[i];
                int val=hashMap.get(nums2[i])-1;
                if(val>0) hashMap.replace(nums2[i],val);
                else hashMap.remove(nums2[i]);
            }
        }
        return Arrays.copyOfRange(res,0,index);
    }
}
```







## [167. 两数之和 II - 输入有序数组](https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted/)

法一：暴力法

```java
public int[] twoSum(int[] numbers, int target) {
    int[] result=new int[2];
    for(int i=0;i<numbers.length-1;i++){
        for(int j=i+1;j<numbers.length;j++){
            if(numbers[i]+numbers[j]==target){
                result[0]=i+1;
                result[1]=j+1;
                return result;
            }
        }
    }
    return result;
}
```

法二：双指针法

对上述的暴力法进行优化，利用好递增的条件：

```
if numbers[i]+numbers[j]>target    then numbers[i]+numbers[++j]>target
if numbers[i]+numbers[j]<target    then numbers[--i]+numbers[j]<target
```

```java
public int[] twoSum2(int[] numbers, int target) {
    int[] result=new int[2];
    int i=0;     //头指针
    int j=numbers.length-1;    //尾指针
    while (i<j){
        if(numbers[i]+numbers[j]==target){
            result[0]=i+1;
            result[1]=j+1;
            break;
        }else if(numbers[i]+numbers[j]<target){
            i++;
        }else{
            j--;
        }
    }
    return result;
}
```



## [283. 移动零](https://leetcode-cn.com/problems/move-zeroes/)

```java
public void moveZeroes(int[] nums) {
    int i=0;  //当下的指针
    int j=0;  //分界的指针
    while(i<nums.length){
        if(nums[i]!=0) {
            nums[j++]=nums[i];
        }
        i++;
    }
    while(j<nums.length){
        nums[j++]=0;
    }
}
```

## [344. 反转字符串](https://leetcode-cn.com/problems/reverse-string/)

```java
public void reverseString(char[] s) {
    int i=0;
    int j=s.length-1;
    while(i<j){
        char temp=s[i];
        s[i]=s[j];
        s[j]=temp;
        i++;
        j--;
    }
}
```



## [1800. 最大升序子数组和](https://leetcode-cn.com/problems/maximum-ascending-subarray-sum/)

```java
class Solution {
    public int maxAscendingSum(int[] nums) {
        int maxSum=Integer.MIN_VALUE;
        int sum=0;
        for(int i=0;i<nums.length;i++){
            if(i==0) {
                sum=nums[i];
            } else if(nums[i]>nums[i-1]) sum+=nums[i];
            else {
                if(sum>maxSum) maxSum=sum;
                sum=nums[i];
            }
        }
        if(sum>maxSum) maxSum=sum;
        return maxSum;
    }
}
```



## [26. 删除有序数组中的重复项](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array/)

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        int i=0;  //不重复指针
        int cur=0;   //当前遍历数组的指针
        for(;cur<nums.length;cur++){
            if(cur==0) i++;
            else if(nums[cur]!=nums[cur-1]){
                nums[i++]=nums[cur];
            }
        }
        return i;
    }
}
```



## [80. 删除有序数组中的重复项 II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array-ii/)

```java
class Solution {
    public int removeDuplicates(int[] nums) {
        if(nums.length==0) return 0;
        
        int index=1;
        int time=0;
        for(int i=1;i<nums.length;i++){
            if(nums[i]!=nums[i-1]){
                time=0;
                nums[index++]=nums[i];
            }else if(time==0){
                time++;
                nums[index++]=nums[i];
            }else{
                time++;
            }
        }

        return index;
    }
}
```



## [27. 移除元素](https://leetcode-cn.com/problems/remove-element/)

```java
class Solution {
    public int removeElement(int[] nums, int val) {
        int cur=0;   //当前遍历数组的指针
        int i=0;   //新数组指针
        for(;cur<nums.length;cur++){
            if(nums[cur]!=val){
                nums[i++]=nums[cur];
            }
        }
        return i;
    }
}
```



## [977. 有序数组的平方](https://leetcode-cn.com/problems/squares-of-a-sorted-array/)

```java
class Solution {
    public int[] sortedSquares(int[] nums) {
        int[] res=new int[nums.length];
        int i=0;   //头指针
        int j=nums.length-1;   //尾指针
        int index=j;   //res的尾指针
        while (i<=j){
            if(Math.abs(nums[i])>Math.abs(nums[j])){
                res[index--]=nums[i]*nums[i];
                i++;
            }else{
                res[index--]=nums[j]*nums[j];
                j--;
            }
        }
        return res;
    }
}
```



## [125. 验证回文串](https://leetcode-cn.com/problems/valid-palindrome/)

```java
class Solution {
    public boolean isPalindrome(String s) {
        int i=0;
        
        StringBuilder stringBuilder=new StringBuilder();
        for(;i<s.length();i++){
            if(Character.isLetterOrDigit(s.charAt(i))){
                stringBuilder.append(s.charAt(i));
            }
        }
        s=stringBuilder.toString();
        s=s.toLowerCase();
        
        i=0;
        int j=s.length()-1;
        boolean res=true;

        while(i<=j){
            if(s.charAt(i)!=s.charAt(j)) return false;
            i++;
            j--;
        }
        return res;
    }
}
```



## [面试题 02.02. 返回倒数第 k 个节点](https://leetcode-cn.com/problems/kth-node-from-end-of-list-lcci/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public int kthToLast(ListNode head, int k) {
        ListNode res=head;
        int i=0;
        int j=0;
        while(head!=null){
            if(j+k-1==i){
                if(j!=0) res=res.next;
                i++;
                j++;

            }else{
                i++;
            }
            head=head.next;
        }
        return res.val;
    }
}
```



## [234. 回文链表](https://leetcode-cn.com/problems/palindrome-linked-list/)

方法一：将值复制到数组中后用双指针法

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public boolean isPalindrome(ListNode head) {
        List<Integer> list=new ArrayList<>();
        while(head!=null){
            list.add(head.val);
            head=head.next;
        }
        int i=0;
        int j=list.size()-1;
        while(i<j){
            if(list.get(i)!=list.get(j)) return false;
            i++;
            j--;
        }
        return true;
    }
}
```

法二：递归法

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {

    private ListNode frontNode;

    public boolean isPalindrome(ListNode head) {
        frontNode=head;
        return helper(head);
    }
    
    public boolean helper(ListNode currentNode){
        if(currentNode!=null){
            if(!helper(currentNode.next)) return false;
            if(currentNode.val!=frontNode.val) return false;
            else frontNode=frontNode.next;
        }
        return true;
    }
}
```

方法三：快慢指针

```java

```



## [925. 长按键入](https://leetcode-cn.com/problems/long-pressed-name/)

方法：以typed为主

```java
class Solution {
    public boolean isLongPressedName(String name, String typed) {
        int i=0;   //name index
        int j=0;   //typed index
        while(j<typed.length()){
            if(i<name.length() && name.charAt(i)==typed.charAt(j)){
                i++;
                j++;
            }else if(j>0 && typed.charAt(j)==typed.charAt(j-1)){
                j++;
            }else {
                return false;
            }
        }
        return i==name.length();
    }
}
```



## [633. 平方数之和](https://leetcode-cn.com/problems/sum-of-square-numbers/)

方法：先确定a与b的范围，然后再双指针暴力法

```java
class Solution {
    public boolean judgeSquareSum(int c) {
        int a=0;   
        int b=(int) Math.sqrt(c+0.0);
        while(a<=b){
            int res=(int)(Math.pow(a,2)+Math.pow(b,2));
            if(res==c) return true;
            else if(res<c) a++;
            else b--;
        }
        return false;
    }
}
```



## [209. 长度最小的子数组](https://leetcode-cn.com/problems/minimum-size-subarray-sum/)

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int sum=0;
        int start=0,end=0;
        int minLen=nums.length+1;
        while(end<nums.length){
            sum+=nums[end];
            end++;
            while(sum>=target){
                if(end-start<minLen) minLen=end-start;
                sum-=nums[start++];
            }
        }
        return minLen>nums.length? 0:minLen;
    }
}
```

## [75. 颜色分类](https://leetcode-cn.com/problems/sort-colors/)

```java
class Solution {
    public void sortColors(int[] nums) {
        int p0=0,p1=0;
        for (int i = 0; i < nums.length; i++) {
            if(nums[i]==0){
                swap(nums,i,p0);
                if(p1>p0){
                    swap(nums,i,p1);
                }
                p0++;
                p1++;
            }else if(nums[i]==1){
                swap(nums,i,p1);
                p1++;
            }
        }
    }

    public void swap(int[] nums,int i,int j){
        int temp=nums[i];
        nums[i]=nums[j];
        nums[j]=temp;
    }
}
```

## [11. 盛最多水的容器](https://leetcode-cn.com/problems/container-with-most-water/)

方法：双指针

在每个状态下，无论长板或短板向中间收窄一格，都会导致水槽底边宽度-1变短：

- 若向内移动短板，水槽的短板可能变大，因此下个水槽的面积可能增大 。
- 若向内移动长板，水槽的短板不变或变小，因此下个水槽的面积一定变小 。

```java
class Solution {
    public int maxArea(int[] height) {
        int left=0,right=height.length-1;
        int max=0;

        while(left<right){
            int area=Math.min(height[left],height[right])*(right-left);
            if(area>max){
                max=area;
            }
            if(height[left]>height[right]){
                right--;
            }else{
                left++;
            }
        }
        return max;
    }
}
```

## [56. 合并区间](https://leetcode-cn.com/problems/merge-intervals/)

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        if(intervals.length==0) return new int[][]{};

        Arrays.sort(intervals, new Comparator<int[]>() {
            @Override
            public int compare(int[] o1, int[] o2) {
                return o1[0]-o2[0];
            }
        });
        List<int[]> res=new ArrayList<>();
        int left=intervals[0][0],right=intervals[0][1];
        for(int i=1;i<intervals.length;i++){
            if(intervals[i][0]-right>0){
                res.add(new int[]{left,right});
                left=intervals[i][0];
                right=intervals[i][1];
            }else{
                right=Math.max(intervals[i][1],right);
            }
        }
        res.add(new int[]{left,right});
        return res.toArray(new int[res.size()][]);
    }
}
```





# 动态规划

## [121. 买卖股票的最佳时机](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock/)

暴力法：

```java
public int maxProfit(int[] prices) {
    int max=0;
    for (int i = 0; i < prices.length-1; i++) {
        for(int j=i+1;j<prices.length;j++){
            max= Math.max(prices[j] - prices[i], max);
        }
    }
    return max;
}
```

一次遍历：

一次买卖，都想在最低价格时买入，最高价格时卖出，所以记录最低价格，有了最低价格再比较卖出利润

```java
public int maxProfit(int[] prices) {
    int minPrice=Integer.MAX_VALUE;
    int maxprofit=0;
    for(int i=0;i<prices.length;i++){
        if(prices[i]<minPrice){
            minPrice=prices[i];
        }else {
            maxprofit=Math.max(prices[i]-minPrice,maxprofit);
        }
    }
    return maxprofit;
}
```



## [53. 最大子序和](https://leetcode-cn.com/problems/maximum-subarray/)

法一：贪心法

若当前所指元素的当前和小于0，则重新来过

```java
 int maxSubArray(int[] nums){
     int maxSum=Integer.MIN_VALUE;    //最大值
     int preSum=0;       //之前和
     int nowSum=0;    //当前和
     for (int i = 0; i < nums.length; i++) {
         nowSum=preSum+nums[i];    
         if(nowSum>maxSum) maxSum=nowSum;
         if(nowSum>=0) preSum=nowSum;    
         else preSum=nowSum=0;
     }
     return maxSum;
 }
```

法二：动态规划

若前一个元素大于0，则将其加到当前元素上

```java
public int maxSubArray2(int[] nums){
    int maxSum=Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        if(i>0 && nums[i-1]>0) nums[i]+=nums[i-1];
        if(nums[i]>maxSum) maxSum=nums[i];
    }
    return maxSum;
}
```



## [70. 爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)

法一：递归法

模拟爬楼梯

```java
class Solution {
    
    //爬楼梯的方法数
    private int climbMethods=0;

    public int climbStairs(int n) {
        climbStairsHelper(n);
        return climbMethods;
    }
	
    //参数n：还剩阶梯数
    public boolean climbStairsHelper(int n){
        if(n==0) return true;
        if(n<0) return false;
        if(climbStairsHelper(n-1)) climbMethods++;
        if(climbStairsHelper(n-2)) climbMethods++;
        return false;
    }
}
```

缺点：费时，提交时超出时间限制了

法二：也是递归法

1级台阶：1种方法

2级台阶：2种方法

3级台阶：3种方法

4级台阶：5种方法

5级台阶：8种方法

6级台阶：13种方法

7级台阶：21种方法

……

通过找规律，可以发现：n级台阶：n-1级台阶的方法+n-2级台阶的方法（n>2)

为什么会这样？其实是因为最后一步只能是一步或者两步

```java
class Solution {
    public int climbStairs(int n) {
        if(n==1) return 1;
        if(n==2) return 2;
        return climbStairs(n-1)+climbStairs(n-2);
    }
}
```

没想到这个也超时了

法三：按着规律顺着来

```java
public int climbStairs3(int n){
    if(n==1) return 1;
    if(n==2) return 2;
    int pre1=2;    //前一步
    int pre2=1;    //前两步
    int now=0;
    for(int i=3;i<=n;i++){
        now=pre1+pre2;
        pre2=pre1;
        pre1=now;
    }
    return now;
}
```



## [746. 使用最小花费爬楼梯](https://leetcode-cn.com/problems/min-cost-climbing-stairs/)

```java
class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int[] dp=new int[cost.length];
        dp[0]=0;
        dp[1]=0;
        int i;
        for(i=2;i<cost.length;i++){
            dp[i]=Math.min(dp[i-2]+cost[i-2],dp[i-1]+cost[i-1]);
        }

        return Math.min(dp[i-2]+cost[i-2],dp[i-1]+cost[i-1]);
    }
}
```

代码优化：

```java
class Solution {
    public int minCostClimbingStairs(int[] cost) {
        int[] dp=new int[cost.length];
        int i;
        for(i=2;i<cost.length;i++){
            dp[i]=Math.min(dp[i-2]+cost[i-2],dp[i-1]+cost[i-1]);
        }
        return Math.min(dp[i-2]+cost[i-2],dp[i-1]+cost[i-1]);
    }
}
```





## [198. 打家劫舍](https://leetcode-cn.com/problems/house-robber/)

```java
class Solution {
    public int rob(int[] nums) {
        int[] robMoney=new int[nums.length];   //记录偷到哪间屋时的最大金额
        for(int i=0;i<nums.length;i++){
            if(i==0){
                robMoney[i]=nums[i];
                continue;
            }
            if(i==1){
                if(nums[i]>robMoney[i-1]){
                    robMoney[i]=nums[i];
                }else{
                    robMoney[i]=robMoney[i-1];
                }
                continue;
            }
            if(i>1){
                if(nums[i]+robMoney[i-2]>robMoney[i-1]){
                    robMoney[i]=nums[i]+robMoney[i-2];
                }else{
                    robMoney[i]=robMoney[i-1];
                }
                continue;
            }
        }
        return robMoney[nums.length-1];
    }
}
```

代码优化版：

```java
class Solution {
    public int rob(int[] nums) {
        if(nums.length==0) return 0;
        if(nums.length==1) return nums[0];
        
        int[] robMoney=new int[nums.length];   //记录偷到哪间屋时的最大金额
        robMoney[0]=nums[0];
        robMoney[1]=Math.max(robMoney[0],nums[1]);
        
        for(int i=2;i<nums.length;i++){
            robMoney[i]=Math.max(nums[i]+robMoney[i-2],robMoney[i-1]);
        }
        return robMoney[nums.length-1];
    }
}
```

优化空间复杂度：

```java
class Solution {
    public int rob(int[] nums) {
        if(nums.length==0) return 0;
        if(nums.length==1) return nums[0];
        
        int[] robMoney=new int[2];   //记录偷到哪间屋时的最大金额
        robMoney[0]=nums[0];
        robMoney[1]=Math.max(robMoney[0],nums[1]);
        
        for(int i=2;i<nums.length;i++){
            robMoney[i%2]=Math.max(nums[i]+robMoney[i%2],robMoney[(i-1)%2]);
        }
        return robMoney[(nums.length-1)%2];
    }
}
```



## [213. 打家劫舍 II](https://leetcode-cn.com/problems/house-robber-ii/)

将首尾相邻变成首位不相邻，方法：拆分数组，一个有头无尾，一个无头有尾

```java
class Solution {
    public int rob(int[] nums) {
        if(nums.length==0) return 0;
        if (nums.length==1) return nums[0];
        if(nums.length==2) return Math.max(nums[0],nums[1]);
        int[][] robMoney=new int[2][nums.length-1];     //偷第一家的:0     不偷第一家的:1

        robMoney[0][0]=nums[0];
        robMoney[0][1]=Math.max(nums[0],nums[1]);
        for(int i=2;i<nums.length-1;i++){
            robMoney[0][i]=Math.max(nums[i]+robMoney[0][i-2],robMoney[0][i-1]);
        }
        
        robMoney[1][0]=nums[1];
        robMoney[1][1]=Math.max(nums[1],nums[2]);
        for(int i=3;i<nums.length;i++){
            robMoney[1][i-1]=Math.max(nums[i]+robMoney[1][i-3],robMoney[1][i-2]);
        }
        
        return Math.max(robMoney[0][nums.length-2],robMoney[1][nums.length-2]);
    }
}
```

优化成一次遍历：

```java
class Solution {
    public int rob(int[] nums) {
        if(nums.length==0) return 0;
        if (nums.length==1) return nums[0];
        if(nums.length==2) return Math.max(nums[0],nums[1]);
        int[][] robMoney=new int[2][nums.length-1];     //偷第一家的:0     不偷第一家的:1

        robMoney[0][0]=nums[0];
        robMoney[0][1]=Math.max(nums[0],nums[1]);

        robMoney[1][0]=nums[1];
        robMoney[1][1]=Math.max(nums[1],nums[2]);
        
        for(int i=2;i<nums.length;i++){
            if(i<nums.length-1) 
                robMoney[0][i]=Math.max(nums[i]+robMoney[0][i-2],robMoney[0][i-1]);
            if(i>2) 
                robMoney[1][i-1]=Math.max(nums[i]+robMoney[1][i-3],robMoney[1][i-2]);
        }
        
        return Math.max(robMoney[0][nums.length-2],robMoney[1][nums.length-2]);
    }
}
```

优化空间复杂度：

```java
class Solution {
    public int rob(int[] nums) {
        if(nums.length==0) return 0;
        if (nums.length==1) return nums[0];
        if(nums.length==2) return Math.max(nums[0],nums[1]);
        int[][] robMoney=new int[2][2];     //偷第一家的:0     不偷第一家的:1

        robMoney[0][0]=nums[0];
        robMoney[0][1]=Math.max(nums[0],nums[1]);

        robMoney[1][0]=nums[1];
        robMoney[1][1]=Math.max(nums[1],nums[2]);

        for(int i=2;i<nums.length;i++){
            if(i<nums.length-1) 
                robMoney[0][i%2]=Math.max(nums[i]+robMoney[0][(i-2)%2],robMoney[0][(i-1)%2]);
            if(i>2) 
                robMoney[1][(i-1)%2]=Math.max(nums[i]+robMoney[1][(i-3)%2],robMoney[1][(i-2)%2]);
        }

        return Math.max(robMoney[0][(nums.length-2)%2],robMoney[1][(nums.length-2)%2]);
    }
}
```



## [337. 打家劫舍 III](https://leetcode-cn.com/problems/house-robber-iii/)

方法：https://leetcode-cn.com/problems/house-robber-iii/solution/san-chong-fang-fa-jie-jue-shu-xing-dong-tai-gui-hu/

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
    public int rob(TreeNode root) {
        if(root==null) return 0;
        int money1=root.val;
        if(root.left!=null){
            money1+=(rob(root.left.left)+rob(root.left.right));
        }
        if(root.right!=null){
            money1+=(rob(root.right.left)+rob(root.right.right));
        }
        int money2=0;
        money2+=(rob(root.left)+rob(root.right));
        return Math.max(money1,money2);
    }
}
```

优化：

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

    private Map<TreeNode,Integer> map=new HashMap<>();

    public int rob(TreeNode root) {
        if (root == null) return 0;
        if(map.containsKey(root)) return map.get(root);
        
        int money = root.val;
        if (root.left != null) {
            money += (rob(root.left.left) + rob(root.left.right));
        }

        if (root.right != null) {
            money += (rob(root.right.left) + rob(root.right.right));
        }

        int maxMoney=Math.max(money, rob(root.left) + rob(root.right));
        map.put(root,maxMoney);
        return maxMoney;
    }   
}
```







## [1137. 第 N 个泰波那契数](https://leetcode-cn.com/problems/n-th-tribonacci-number/)

```java
class Solution {
    public int tribonacci(int n) {
        if(n==0) return 0;
        if(n<3) return 1;
        int[] dp=new int[n+1];
        dp[0]=0;
        dp[1]=1;
        dp[2]=1;
        int i=3;
        while(i<=n){
            dp[i]=dp[i-3]+dp[i-2]+dp[i-1];
            i++;
        }
        return dp[n];
    }
}
```

优化空间复杂度：

```java
class Solution {
    public int tribonacci(int n) {
        if(n==0) return 0;
        if(n<3) return 1;
        int[] dp=new int[4];
        dp[0]=0;
        dp[1]=1;
        dp[2]=1;
        int i=3;
        while(i<=n){
            int t3=i%4;
            dp[t3]=dp[(t3+1)%4]+dp[(t3+2)%4]+dp[(t3+3)%4];
            i++;
        }
        return dp[(i-1)%4];
    }
}
```

## [413. 等差数列划分](https://leetcode-cn.com/problems/arithmetic-slices/)

方法一：废空间

```java
class Solution {
    public int numberOfArithmeticSlices(int[] nums) {
        if(nums.length<3) return 0;

        //求数组相邻元素间的差值
        int[] diffs=new int[nums.length-1];
        for(int i=0;i<nums.length-1;i++){
            diffs[i]=nums[i+1]-nums[i];
        }

        //统计相同差值的数目
        List<Integer> corns=new ArrayList<>();
        int num=1;
        for(int i=1;i<diffs.length;i++){
            if(diffs[i]==diffs[i-1]){
                num++;
                if(i==diffs.length-1 && num>1){
                    corns.add(num+1);
                }
            }else{
                if(num>1){
                    corns.add(num+1);
                }
                num=1;
            }
        }

        //计算子数组的个数
        int res=0;
        for(int corn:corns){
            res+=((corn-1)*(corn-2)/2);
        }

        return res;
    }
}
```

优化时间和空间：

```java
class Solution {
    public int numberOfArithmeticSlices(int[] nums) {
        int res=0;
        if(nums.length<3) return res;

        int diff=0;
        int sameDiffNum=0;
        for(int i=1;i<nums.length;i++){
            if((nums[i]-nums[i-1])==diff){
                sameDiffNum++;
                if(i==nums.length-1 && sameDiffNum>1){
                    res+=(sameDiffNum*(sameDiffNum-1)/2);
                }
            }else{
                if(sameDiffNum>1){
                    res+=(sameDiffNum*(sameDiffNum-1)/2);
                }
                sameDiffNum=1;
                diff=nums[i]-nums[i-1];
            }
        }

        return res;
    }
}
```

## [62. 不同路径](https://leetcode-cn.com/problems/unique-paths/)

方法一：超时

```java
class Solution {
    private int path=0;
    public int uniquePaths(int m, int n) {
        if(m==1 && n==1){
            ++path;
        }else{
            if(m>1) uniquePaths(m-1,n);
            if(n>1) uniquePaths(m,n-1);
        }
        return path;
    }
}
```

方法二：动态规划

第一排和第一列的都固定为一。

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp=new int[m][n];
        for(int i=0;i<n;++i){
            dp[0][i]=1;
        }
        for(int i=0;i<m;++i){
            dp[i][0]=1;
        }
        for(int i=1;i<m;++i){
            for(int j=1;j<n;++j){
                dp[i][j]=dp[i-1][j]+dp[i][j-1];
            }
        }
        return dp[m-1][n-1];
    }
}
```

优化：模拟一下就知道了

```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp=new int[n];
        Arrays.fill(dp,1);
        for(int i=1;i<m;++i){
            for(int j=1;j<n;++j){
                dp[j]+=dp[j-1];
            }
        }
        return dp[n-1];
    }
}
```

## [63. 不同路径 II](https://leetcode-cn.com/problems/unique-paths-ii/)

```java
class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        if(obstacleGrid[0][0]==1) return 0;
        obstacleGrid[0][0]=1;
        int i=1;
        boolean flag=false;
        while(i<obstacleGrid.length){
            if(flag){
                obstacleGrid[i][0]=0;
            }else if(obstacleGrid[i][0]==0){
                obstacleGrid[i][0]=1;
            }else{
                obstacleGrid[i][0]=0;
                flag=true;
            }
            ++i;
        }

        i=1;
        flag=false;
        while(i<obstacleGrid[0].length){
            if(flag){
                obstacleGrid[0][i]=0;
            }else if(obstacleGrid[0][i]==0){
                obstacleGrid[0][i]=1;
            }else{
                obstacleGrid[0][i]=0;
                flag=true;
            }
            ++i;
        }

        for(i=1;i<obstacleGrid.length;i++){
            for(int j=1;j<obstacleGrid[0].length;j++){
                if(obstacleGrid[i][j]==0){
                    obstacleGrid[i][j]=obstacleGrid[i-1][j]+obstacleGrid[i][j-1];
                }else{
                    obstacleGrid[i][j]=0;
                }
            }
        }

        return obstacleGrid[obstacleGrid.length-1][obstacleGrid[0].length-1];
    }
}
```





## [64. 最小路径和](https://leetcode-cn.com/problems/minimum-path-sum/)

```java
class Solution {
    public int minPathSum(int[][] grid) {
        for(int i=1;i<grid.length;i++){
            grid[i][0]+=grid[i-1][0];
        }
        for(int i=1;i<grid[0].length;i++){
            grid[0][i]+=grid[0][i-1];
        }
        for(int i=1;i<grid.length;i++){
            for(int j=1;j<grid[0].length;j++){
                if(grid[i][j-1]<grid[i-1][j]){
                    grid[i][j]+=grid[i][j-1];
                }else{
                    grid[i][j]+=grid[i-1][j];
                }
            }
        }
        return grid[grid.length-1][grid[0].length-1];
    }
}
```

## [343. 整数拆分](https://leetcode-cn.com/problems/integer-break/)

方法一：数学法

![image-20211011202503066](D:\blog\source\_drafts\leetcode刷题\13.png)

```java
class Solution {
    public int integerBreak(int n) {
        if(n<=3) return n-1;
        int a=n/3;
        int b=n%3;
        if(b==0) return (int) Math.pow(3,a);
        else if(b==1) return (int) Math.pow(3,a-1)*4;
        else return (int) Math.pow(3,a)*2;
    }
}
```

方法二：动态规划

![image-20211011204426312](D:\blog\source\_drafts\leetcode刷题\14.png)

```java
class Solution {
    public int integerBreak(int n) {
        int[] dp=new int[n+1];
        for(int i=2;i<=n;i++){
            int curMax=0;
            for(int j=1;j<i;j++){
                curMax=Math.max(curMax,Math.max(j*(i-j),j*dp[i-j]));
            }
            dp[i]=curMax;
        }
        return dp[n];
    }
}
```

## [120. 三角形最小路径和](https://leetcode-cn.com/problems/triangle/)

```java
class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int res=Integer.MAX_VALUE;
        for(int i=1;i<triangle.size();i++){
            for(int j=0;j<triangle.get(i).size();j++){
                if(j-1>=0 && j<triangle.get(i-1).size()){
                    int now=triangle.get(i).get(j);
                    now+=Math.min(triangle.get(i-1).get(j-1),triangle.get(i-1).get(j));
                    triangle.get(i).set(j, now);
                }else if(j-1>=0){
                    int now=triangle.get(i).get(j);
                    now+=triangle.get(i-1).get(j-1);
                    triangle.get(i).set(j,now);
                }else{
                    int now=triangle.get(i).get(j);
                    now+=triangle.get(i-1).get(j);
                    triangle.get(i).set(j,now);
                }
            }
        }
        for(int p:triangle.get(triangle.size()-1)){
            if(p<res){
                res=p;
            }
        }
        return res;
    }
}
```

## [518. 零钱兑换 II](https://leetcode-cn.com/problems/coin-change-2/)

方法：动态规划

```java
class Solution {
    public int change(int amount, int[] coins) {
        int[] dp=new int[amount+1];
        dp[0]=1;
        for(int coin : coins){
            for(int i=coin;i<=amount;i++){
                dp[i]+=dp[i-coin];
            }
        }
        return dp[amount];
    }
}
```

## [125 · 背包问题（二）](https://www.lintcode.com/problem/125)

0-1背包问题

**思路：**

1. 如果装不下当前物品，那么前n个物品的最佳组合和前n-1个物品的最佳组合是一样的

2. 如果装得下当前物品

   - 假设1：装当前物品，在给当前物品预留了相应空间的情况下，前n-1个物品的最佳组合加上当前物品的价值就是总价值。
   - 假设2:不装当前物品，那么前n个物品的最佳组合和前n-1个物品的最佳组合是一样的

   - 选取假设1和假设2中较大的价值，为当前最佳组合的价值。

**例子：**

![image-20211029194943474](D:\blog\source\_drafts\leetcode刷题\15.png)

dp：

![image-20211029202102035](D:\blog\source\_drafts\leetcode刷题\16.png)

参考：[【动态规划】背包问题](https://www.bilibili.com/video/BV1K4411X766?from=search&seid=8411772669347516386&spm_id_from=333.337.0.0)

```java
public class Solution {
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @param V: Given n items with value V[i]
     * @return: The maximum value
     */
    public int backPackII(int m, int[] A, int[] V) {
        // dp[i][j]: 表示背包大小为j,可放进前i个物品，背包可容纳的最大价值
        int[][] dp=new int[A.length+1][m+1];
        for(int i=1;i<dp.length;i++){    //遍历物品
            for(int j=1;j<m+1;j++){      //在可放进前i个物品，背包大小为j的前提下，背包可容纳的最大价值
                if(j<A[i-1]){    //当前的背包不能放入物品i
                    dp[i][j]=dp[i-1][j];
                }else{      //当前的背包能放入物品(i-1)
                    // dp[i-1][j]: 大小为j的背包不放入物品(i-1)的价值
                    // dp[i-1][j-A[i-1]]:  大小为j的背包，在腾空物品(i-1)所需的空间，和不放入物品(i-1)的价值
                    // dp[i-1][j-A[i-1]]+V[i-1]:  腾空后的背包装入物品(i-1)的价值
                    dp[i][j]=Math.max(dp[i-1][j],dp[i-1][j-A[i-1]]+V[i-1]);
                }
            }
        }
        return dp[A.length][m];
    }
}
```

优化空间复杂度：

为了防止计算结果被覆盖，得从后向前分别进行计算

```java
public class Solution {
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @param V: Given n items with value V[i]
     * @return: The maximum value
     */
    public int backPackII(int m, int[] A, int[] V) {
        // dp[i]: 表示背包大小为i,背包可容纳的最大价值
        int[] dp=new int[m+1];
        for(int i=0;i<A.length;i++){
            for(int j=m;j>=0;j--){
                if(j>=A[i]){
                    dp[j]=Math.max(dp[j],dp[j-A[i]]+V[i]);
                }
            }
        }
        return dp[m];
    }
}
```

优化时间：

```java
public class Solution {
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @param V: Given n items with value V[i]
     * @return: The maximum value
     */
    public int backPackII(int m, int[] A, int[] V) {
        // dp[i]: 表示背包大小为i,背包可容纳的最大价值
        int[] dp=new int[m+1];
        for(int i=0;i<A.length;i++){
            for(int j=m;j>=A[i];j--){
                dp[j]=Math.max(dp[j],dp[j-A[i]]+V[i]);
            }
        }
        return dp[m];
    }
}
```



**进阶：** 列出背包最后装入哪些物品

思路：从表的右下角开始回溯，如果发现前n个物品最佳组合的价值和前n-1个物品最佳组合的价值一样，说明第n个物品没有被装入。否则，第n个物品被装入。

```java
public List<Integer> backPackII2(int m, int[] A, int[] V) {
    int[][] dp=new int[A.length+1][m+1];
    for(int i=1;i<dp.length;i++){    
        for(int j=1;j<m+1;j++){      
            if(j<A[i-1]){    
                dp[i][j]=dp[i-1][j];
            }else{    
                dp[i][j]=Math.max(dp[i-1][j],dp[i-1][j-A[i-1]]+V[i-1]);
            }
        }
    }

    List<Integer> res=new ArrayList<>();
    int i=dp.length-1;
    int j=m;
    while(i>0 && j>0){
        if(dp[i][j]==dp[i-1][j]){
            i--;
        }
        else{
            res.add(i-1);
            j-=A[i-1];
            i--;
        }
    }
    return res;
}
```

## [92 · 背包问题](https://www.lintcode.com/problem/92)

125 · 背包问题（二）的特例，价值=体积。

总的来说，思路是一样的：

1. 如果装不下当前物品，那么前n个物品的最佳组合和前n-1个物品的最佳组合是一样的

2. 如果装得下当前物品

   - 假设1：装当前物品，在给当前物品预留了相应空间的情况下，前n-1个物品的最佳组合加上当前物品的价值就是总价值。
   - 假设2:不装当前物品，那么前n个物品的最佳组合和前n-1个物品的最佳组合是一样的

   - 选取假设1和假设2中较大的价值，为当前最佳组合的价值。

```java
public class Solution {
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @return: The maximum size
     */
    public int backPack(int m, int[] A) {
        // dp[i][j]: 背包大小为j,可放进前i个物品,背包可容纳的最大重量
        int dp[][] = new int[A.length + 1][m + 1];
        for(int i=1;i<dp.length;i++){
            for(int j=1;j<m+1;j++){
                if(j<A[i-1]){    // 装不进
                    dp[i][j]=dp[i-1][j];
                }else{     //装得进
                    dp[i][j]=Math.max(dp[i-1][j],dp[i-1][j-A[i-1]]+A[i-1]);
                }
            }
        }
        return dp[A.length][m];
    }
}
```

优化空间和时间版：

同样，为了防止计算结果被覆盖，得从后向前分别进行计算

```java
public class Solution {
    /**
     * @param m: An integer m denotes the size of a backpack
     * @param A: Given n items with size A[i]
     * @return: The maximum size
     */
    public int backPack(int m, int[] A) {
        // dp[j]: 大小为j的背包可容纳的最大重量
        int dp[] = new int[m + 1];
        for(int i=0;i<A.length;i++){
            for(int j=m;j>=A[i];j--){
                dp[j]=Math.max(dp[j],dp[j-A[i]]+A[i]);
            }
        }
        return dp[m];
    }
}
```



## [440 · 背包问题 III](https://www.lintcode.com/problem/440)

125 · 背包问题（二）的进化版，物品数量不限。

之前是与没放进物品i的dp比较，现在要与放进物品i的dp比较

**思路：**

1. 如果装不下当前物品，那么前n个物品的最佳组合和前n-1个物品的最佳组合是一样的

2. 如果装得下当前物品

   - 假设1：装当前物品，在给当前物品预留了相应空间的情况下，==当前背包重量-物品n重量==的最佳组合加上当前物品的价值就是总价值。**（different）**
   - 假设2:不装当前物品，那么前n个物品的最佳组合和前n-1个物品的最佳组合是一样的

   - 选取假设1和假设2中较大的价值，为当前最佳组合的价值。

```java
public class Solution {
    /**
     * @param A: an integer array
     * @param V: an integer array
     * @param m: An integer
     * @return: an array
     */
    public int backPackIII(int[] A, int[] V, int m) {
        int[][] dp=new int[A.length+1][m+1];
        for(int i=1;i<dp.length;i++){
            for(int j=1;j<m+1;j++){
                if(j<A[i-1]){   //装不进
                    dp[i][j]=dp[i-1][j];
                }else{    //装得进
                    dp[i][j]=Math.max(dp[i-1][j],dp[i][j-A[i-1]]+V[i-1]);
                }
            }
        }
        return dp[A.length][m];
    }
}
```

优化空间复杂度：

这里需要从前向后分别进行计算

```java
public class Solution {
    /**
     * @param A: an integer array
     * @param V: an integer array
     * @param m: An integer
     * @return: an array
     */
    public int backPackIII(int[] A, int[] V, int m) {
        int[] dp=new int[m+1];
        for(int i=0;i<A.length;i++){
            for(int j=A[i];j<m+1;j++){
                dp[j]=Math.max(dp[j],dp[j-A[i]]+V[i]);
            }
        }
        return dp[m];
    }
}
```



## [562 · 背包问题 IV](https://www.lintcode.com/problem/562)

该问题与 [518. 零钱兑换 II](https://leetcode-cn.com/problems/coin-change-2/) 是一样的

思路：

1. 如果装不下当前物品，那么前n个物品能填满当前背包的方案数与前n-1个物品能填满当前背包的方案数相同
2. 如果能装下当前物品
   - 假设1：当前物品的重量等于当前背包的大小，那么当前背包方案数为前n-1个物品能填满当前背包的方案数+1
   - 假设2：当前物品的重量大于当前背包的大小，那么当前背包方案数为前n-1个物品能填满当前背包的方案数+减去当前物品重量的背包的方案数

```java
public class Solution {
    /**
     * @param nums: an integer array and all positive numbers, no duplicates
     * @param target: An integer
     * @return: An integer
     */
    public int backPackIV(int[] nums, int target) {
        int[][] dp=new int[nums.length+1][target+1];
        for(int i=1;i<nums.length+1;i++){
            for(int j=1;j<target+1;j++){
                if(j<nums[i-1]){
                    dp[i][j]=dp[i-1][j];
                }else if(j==nums[i-1]){
                    dp[i][j]=dp[i-1][j]+1;
                }else {
                    dp[i][j]=dp[i-1][j]+dp[i][j-nums[i-1]];
                }
            }
        }
        return dp[nums.length][target];
    }
}
```

优化空间和时间：

```java
public class Solution {
    /**
     * @param nums: an integer array and all positive numbers, no duplicates
     * @param target: An integer
     * @return: An integer
     */
    public int backPackIV(int[] nums, int target) {
        int[] dp=new int[target+1];
        for(int i=0;i<nums.length;i++){
            for(int j=nums[i];j<=target;j++){
                if(j==nums[i]){
                    ++dp[j];
                }else{
                    dp[j]+=dp[j-nums[i]];
                }
            }
        }
        return dp[target];
    }
}
```



## [563 · 背包问题 V](https://www.lintcode.com/problem/563)

562 · 背包问题 IV的变化版

```java
public class Solution {
    /**
     * @param nums: an integer array and all positive numbers
     * @param target: An integer
     * @return: An integer
     */
    public int backPackV(int[] nums, int target) {
        int[][] dp=new int[nums.length+1][target+1];
        for(int i=1;i<=nums.length;i++){
            for(int j=1;j<=target;j++){
                if(j<nums[i-1]){
                    dp[i][j]=dp[i-1][j];
                }else if(j==nums[i-1]){
                    dp[i][j]=dp[i-1][j]+1;
                }else{
                    dp[i][j]=dp[i-1][j-nums[i-1]]+dp[i-1][j];
                }
            }
        }
        return dp[nums.length][target];
    }
}
```

优化空间和时间：

值得注意的是：

- 当每一个物品只能使用一次时，得从后往前遍历，防止计算结果被覆盖
- 当每一个物品可使用无限次时，就要从前往后遍历

```java
public class Solution {
    /**
     * @param nums: an integer array and all positive numbers
     * @param target: An integer
     * @return: An integer
     */
    public int backPackV(int[] nums, int target) {
        int[] dp=new int[target+1];
        for(int i=0;i<nums.length;i++){
            for(int j=target;j>=nums[i];j--){
                if(j==nums[i]){
                    ++dp[j];
                }else{
                    dp[j]+=dp[j-nums[i]];
                }
            }
        }
        return dp[target];
    }
}
```








# 二分查找

## [1351. 统计有序矩阵中的负数](https://leetcode-cn.com/problems/count-negative-numbers-in-a-sorted-matrix/)

暴力法：

```java
class Solution {
    public int countNegatives(int[][] grid) {
        int i=0;   //行
        int j;   //列
        int num=0;
        for(;i<grid.length;i++){
            j=0;
            for(;j<grid[0].length;j++){
                if(grid[i][j]<0){
                    num+=(grid[0].length-j);
                    break;
                } 
            }
        }
        return num;
    }
}
```

二分查找

```java
class Solution {
    public int countNegatives(int[][] grid) {
        int num=0;
        for (int[] ints : grid) {
            int i=0;  //头指针
            int j=ints.length-1;   //尾指针
            while(i<=j){
                int mid=i+(j-i)/2;   //中间指针
                if(ints[mid]>=0){
                    i=mid+1;
                }else{
                    j=mid-1;
                }
            }
            num+=(ints.length-i);
        }
        return num;
    }
}
```



## 找出分界线

数组单调递减，找出第一个负数的位置

```java
public int findMiddle(int[] nums){
    int i=0;
    int j=nums.length-1;
    while(i<=j){
        int mid=i+(j-i)/2;
        if(nums[mid]>=0){
            i=mid+1;
        }else{
            j=mid-1;
        }
    }
    return i>=nums.length? -1:i;
}
```

数组单调递增，找出第一个负数的位置

```java
public int findMiddle(int[] nums){
    int i=0;
    int j=nums.length-1;
    while(i<=j){
        int mid=i+(j-i)/2;
        if(nums[mid]>=0){
            j=mid-1;
        }else{
            i=mid+1;
        }
    }
    return j>=0? j:-1;
}
```



## [35. 搜索插入位置](https://leetcode-cn.com/problems/search-insert-position/)

```java
class Solution {
    public int searchInsert(int[] nums, int target) {
        int left=0;
        int right=nums.length-1;
        while(left<=right){
            int mid=left+(right-left)/2;
            if(nums[mid]<target) left=mid+1;
            else if(nums[mid]==target) return mid;
            else right=mid-1;
        }
        return left;
    }
}
```



## [704. 二分查找](https://leetcode-cn.com/problems/binary-search/)

```java
class Solution {
    public int search(int[] nums, int target) {
        int left=0;
        int right=nums.length-1;
        while(left<=right) {
            int mid = left + (right - left) / 2;
            if(nums[mid]<target) left=mid+1;
            else if(nums[mid]==target) return mid;
            else right=mid-1;
        }
        return -1;
    }
}
```



## 852. 山脉数组的峰顶索引

方法一：遍历法

```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int i=1;
        while(i<arr.length){
            if(arr[i]<arr[i-1]) return i-1;
            else i++;
        }
        return i-1;
    }
}
```

方法二：二分查找法，通过二分查找来淘汰一半元素

```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int low=0;
        int high=arr.length-1;
        while(low<high){
            int mid=low+(high-low)/2;
            if(arr[mid]<arr[mid+1]){
                low=mid+1;
            }else{
                high=mid;  
            }
        }
        return high;
    }
}
```

## [441. 排列硬币](https://leetcode-cn.com/problems/arranging-coins/)

法一：暴力

```java
class Solution {
    public int arrangeCoins(int n) {
        int i=1;
        while(true){
            if(n>=i){
                n-=i;
                i++;
            }else{
                break;
            }
        }
        return i-1;
    }
}
```





## 1. 两数之和

方法一：暴力

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] res=new int[2];
        for(int i=0;i<nums.length-1;i++){
            for(int j=i+1;j<nums.length;j++){
                if(nums[i]+nums[j]==target){
                    res[0]=i;
                    res[1]=j;
                    return res;
                }
            }
        }
        return res;
    }
}
```

方法二.哈希表法

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer,List<Integer>> hashMap=new HashMap<>();   //对于nums[i],key=nums[i],value=[i]
        for(int i=0;i<nums.length;i++){
            if(hashMap.containsKey(nums[i])){
                List<Integer> list=hashMap.get(nums[i]);
                list.add(i);
                System.out.println("nums: "+nums[i]);
                System.out.println("list: "+list);
                hashMap.replace(nums[i],list);
            }else{
                List<Integer> list=new ArrayList<>();
                list.add(i);
                hashMap.put(nums[i],list);
            }
        }

        int[] res=new int[2];
        for(int i=0;i<nums.length;i++){
            int num=target-nums[i];
            if(num!=nums[i] ){
                if(hashMap.containsKey(num)){
                    res[0]=i;
                    res[1]=hashMap.get(num).get(0);
                    return res;
                }
            }else{
                if(hashMap.containsKey(num)){
                    List<Integer> list=hashMap.get(num);
                    if(list.size()>1){
                        res[0]=list.get(0);
                        res[1]=list.get(1);
                        return res;
                    }
                }
            }
        }
        return res;
    }
}
```

方法三. 对哈希表法进行优化

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer,Integer> hashMap=new HashMap<>();
        for(int i=0;i<nums.length;i++){
            if(hashMap.containsKey(target-nums[i])){
                return new int[]{hashMap.get(target-nums[i]),i};
            } 
            hashMap.put(nums[i],i);
        }
        throw new IllegalArgumentException("No tow sum solution");
    }
}
```



## [1011. 在 D 天内送达包裹的能力](https://leetcode-cn.com/problems/capacity-to-ship-packages-within-d-days/)

二分查找法，运载重量：[max(weights)，sum(weights)]

```java
class Solution {
    public int shipWithinDays(int[] weights, int D) {
        int minRes=0;    //最小运载重量
        int maxRes=0;    //最大运载重量
        for(int i=0;i<weights.length;i++){
            if(weights[i]>minRes) minRes=weights[i];
            maxRes+=weights[i];
        }
        while(minRes<maxRes){
            int mid=minRes+(maxRes-minRes)/2;
            int day=0;   //运载重量为mid时，所需要的天数
            for(int j=0;j<weights.length;){
                int dayWeight=0;
                while(true){
                    if(j<weights.length && dayWeight+weights[j]<=mid){
                        dayWeight+=weights[j++];
                    }else{
                        day++;
                        break;
                    }
                }
            }

            if(day>D) minRes=mid+1;
            else maxRes=mid;
        }
        return minRes;
    }
}
```



## [367. 有效的完全平方数](https://leetcode-cn.com/problems/valid-perfect-square/)

```java
class Solution {
    public boolean isPerfectSquare(int num) {
        int left=0,right=num;
        while(left<=right){
            int mid=left+(right-left)/2;
            if((long)mid*mid>num) right=mid-1;
            else if((long)mid*mid==num) return true;
            else left=mid+1;
        }
        return false;
    }
}
```



## [1385. 两个数组间的距离值](https://leetcode-cn.com/problems/find-the-distance-value-between-two-arrays/)

```java
class Solution {
    public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
        int num=0;
        for(int i=0;i<arr1.length;i++){
            boolean flag=true;
            for(int j=0;j<arr2.length;j++){
                if(Math.abs(arr1[i]-arr2[j])<=d){
                    flag=false;
                    break;
                }
            }
            if(flag) num++;
        }
        return num;
    }
}
```



## [278. 第一个错误的版本](https://leetcode-cn.com/problems/first-bad-version/)

方法一：暴力（超时）

```java
/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */

public class Solution extends VersionControl {
    
    public int firstBadVersion(int n) {
        int i=1;
        while(i<=n){
            if(isBadVersion(i)) break;
            i++;
        }    
        return i;
    }
}
```

方法二：二分查找

```java
/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */

public class Solution extends VersionControl {
    
    public int firstBadVersion(int n) {
        int start=1,end=n;
        while(start<end){
            int mid=start+(end-start)/2;
            if(isBadVersion(mid)) end=mid;
            else start=mid+1;
        }
        return start;
    }
}
```

优化版：

```java
/* The isBadVersion API is defined in the parent class VersionControl.
      boolean isBadVersion(int version); */

public class Solution extends VersionControl {
    
    public int firstBadVersion(int n) {
        int start=1,end=n;
        while(start<end){
            if(isBadVersion(start+(end-start)/2)) end=start+(end-start)/2;
            else start=start+(end-start)/2+1;
        }
        return start;
    }
}
```

## [374. 猜数字大小](https://leetcode-cn.com/problems/guess-number-higher-or-lower/)

```java
/** 
 * Forward declaration of guess API.
 * @param  num   your guess
 * @return 	     -1 if num is lower than the guess number
 *			      1 if num is higher than the guess number
 *               otherwise return 0
 * int guess(int num);
 */

public class Solution extends GuessGame {
    public int guessNumber(int n) {
        int left=1,right=n;
        while(left<right){
            int mid=left+(right-left)/2;
            int res=guess(mid);
            if(res==0) return mid;
            else if(res==-1) right=mid-1;
            else left=mid+1;
        }
        return left;
    }
}
```



## [852. 山脉数组的峰顶索引](https://leetcode-cn.com/problems/peak-index-in-a-mountain-array/)

方法一：暴力

```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int i=0;
        while(arr[i]<arr[i+1]) i++;
        return i;
    }
}
```

方法二：二分

```java
class Solution {
    public int peakIndexInMountainArray(int[] arr) {
        int left=0,right=arr.length-1;
        while(left<right){
            int mid=left+(right-left)/2;
            if(arr[mid]>arr[mid+1]){
                right=mid;
            }else{
                left=mid+1;
            }
        }
        return left;
    }
}
```



## 在排序数组中查找元素的第一个位置

方法：二分查找

```java
public int searchFirst(int[] nums,int target){
    return searchFirstHelper(nums,0,nums.length-1,target);
}

public int searchFirstHelper(int[] nums,int left,int right,int target){
    int res=-1;
    int l=left,r=right;
    while(l<=r){
        int mid=l+(r-l)/2;
        if(nums[mid]==target){
            res=mid;
            break;
        }else if(nums[mid]<target){
            l=mid+1;
        }else{
            r=mid-1;
        }
    }
    if(l<=r){
        int leftRes = searchFirstHelper(nums, left, res - 1, target);
        if(leftRes!=-1 && res>leftRes) res=leftRes;
    }
    return res;
}
```





## [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

方法一：暴力

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int[] res=new int[]{-1,-1};
        for(int i=0;i<nums.length;i++){
            if(nums[i]==target){
                if(res[0]==-1) res[0]=i;
                res[1]=i;
            }
        }
        return res;
    }
}
```

方法二：二分法

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        return searchRangeHelper(nums,0,nums.length-1,target);
    }

    public int[] searchRangeHelper(int[] nums,int left,int right,int target){
        int[] res=new int[]{-1,-1};
        int l=left,r=right;
        while(l<=r){
            int mid=l+(r-l)/2;
            if(nums[mid]==target){
                res[0]=mid;
                res[1]=mid;
                break;
            }else if(nums[mid]<target){
                l=mid+1;
            }else{
                r=mid-1;
            }
        }
        if(l<=r){
            int leftRes=searchRangeHelper(nums,left,res[0]-1,target)[0];
            int rightRes=searchRangeHelper(nums,res[1]+1,right,target)[1];
            if(leftRes!=-1 && res[0]>leftRes) res[0]=leftRes;
            if(rightRes!=-1 && res[1]<rightRes) res[1]=rightRes;
        }
        return res;
    }
}
```





## [剑指 Offer 53 - I. 在排序数组中查找数字 I](https://leetcode-cn.com/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/)

方法一：暴力

```java
class Solution {
    public int search(int[] nums, int target) {
        int res=0;
        for(int num:nums){
            if(target==num) res++;
        }
        return res;
    }
}
```

方法二：二分查找

```java
class Solution {
    public int search(int[] nums, int target) {
        int[] indexRange=searchRangeHelper(nums,0,nums.length-1,target);
        if(indexRange[0]==-1) return 0;
        return indexRange[1]-indexRange[0]+1;
    }

    public int[] searchRangeHelper(int[] nums,int left,int right,int target){
        int[] res=new int[]{-1,-1};
        int l=left,r=right;
        while(l<=r){
            int mid=l+(r-l)/2;
            if(nums[mid]==target){
                res[0]=mid;
                res[1]=mid;
                break;
            }else if(nums[mid]<target){
                l=mid+1;
            }else{
                r=mid-1;
            }
        }
        if(l<=r){
            int leftRes=searchRangeHelper(nums,left,res[0]-1,target)[0];
            int rightRes=searchRangeHelper(nums,res[1]+1,right,target)[1];
            if(leftRes!=-1 && res[0]>leftRes) res[0]=leftRes;
            if(rightRes!=-1 && res[1]<rightRes) res[1]=rightRes;
        }
        return res;
    }
}
```









# 数学

## [7. 整数反转](https://leetcode-cn.com/problems/reverse-integer/)

```java
class Solution {
    public int reverse(int x) {
        int res=0;
        boolean flag=false;   //标记x是否为负数
        if(x<0){
            flag=true;
            x=-x;
        }
        while(x>0){
            int num=x%10;
            if(res>(Integer.MAX_VALUE-num)/10) return 0;
            res=res*10+num;
            x=x/10;
        }

        return flag? -res:res;
    }
}
```



## [1720. 解码异或后的数组](https://leetcode-cn.com/problems/decode-xored-array/)

异或知识点：

```mathematica
x ^ x = 0
a ^ 0 = a
a ^ b = b ^ a
(a ^ b) ^ c = a ^ (b ^ c)
```

由此可推导：

```mathematica
a ^ b = c
a ^ b ^ b = c ^ b
a = c ^ b
```

```java
class Solution {
    public int[] decode(int[] encoded, int first) {
        int[] arr=new int[encoded.length+1];
        arr[0]=first;
        for (int i = 1; i < arr.length; i++) {
            arr[i]=encoded[i-1]^arr[i-1];
        }
        return arr;
    }
}
```

## [1486. 数组异或操作](https://leetcode-cn.com/problems/xor-operation-in-an-array/)

```java
class Solution {
    public int xorOperation(int n, int start) {
        int res=start;
        for(int i=1;i<n;i++) res^=(start+2*i);
        return res;
    }
}
```

## [421. 数组中两个数的最大异或值](https://leetcode-cn.com/problems/maximum-xor-of-two-numbers-in-an-array/)

方法一：暴力法

```java
class Solution {
    public int findMaximumXOR(int[] nums) {
        int max=Integer.MIN_VALUE;
        for(int i=0;i<nums.length;i++){
            for(int j=i;j<nums.length;j++){
                if((nums[i]^nums[j])>max) max=nums[i]^nums[j];
            }
        }
        return max;
    }
}
```





## [9. 回文数](https://leetcode-cn.com/problems/palindrome-number/)

```java
class Solution {
    public boolean isPalindrome(int x) {
        if(x<0) return false;
        char[] chars = String.valueOf(x).toCharArray();
        int i=0,j=chars.length-1;
        while(i<j){
            if(chars[i++]!=chars[j--]) return false;
        }
        return true;
    }
}
```

## [1734. 解码异或后的排列](https://leetcode-cn.com/problems/decode-xored-permutation/)


```java
class Solution {
    /*
    由题目可知，perm数组中的数字是`1`~`encoded.length+1`，且不重复
	设n=5
	perm=[a,b,c,d,e]，enco=[f,g,h,i]
	a^b^c^d^e的结果是知道的，假设为total
	我们知道的是enco的值，只需要找到perm的随意一个位置的值就可以构造答案
	可以发现：
   		f=a^b
   		g=b^c
   		h=c^d
   		i=d^e
   	现在知道a^b^c^d^e，可以用g=b^c和i=d^e去消除，即：a^g^i=total,
   	接着就得到：a=total^g^i
   	然后就可得到全部perm
    */
    public int[] decode(int[] encoded) {
        int[] perm=new int[encoded.length+1];
        int total=0;
        for(int i=1;i<=perm.length;i++){
            total^=i;
        }
        int right=0;
        for(int i=1;i<encoded.length;i+=2){
            right^=encoded[i];
        }
        perm[0]=total^right;
        for(int i=1;i<perm.length;i++){
            perm[i]=encoded[i-1]^perm[i-1];
        }
        return perm;
    }
}
```



## [12. 整数转罗马数字](https://leetcode-cn.com/problems/integer-to-roman/)

```java
class Solution {
    public String intToRoman(int num) {
        StringBuilder stringBuilder = new StringBuilder();
        while (num > 0) {
            if (num >= 1000) {
                stringBuilder.append('M');
                num -= 1000;
            } else if (num >= 900) {
                stringBuilder.append("CM");
                num -= 900;
            } else if (num >= 500) {
                stringBuilder.append('D');
                num -= 500;
            } else if (num >= 400) {
                stringBuilder.append("CD");
                num -= 400;
            } else if (num >= 100) {
                stringBuilder.append('C');
                num -= 100;
            } else if (num >= 90) {
                stringBuilder.append("XC");
                num -= 90;
            } else if (num >= 50) {
                stringBuilder.append('L');
                num -= 50;
            } else if (num >= 40) {
                stringBuilder.append("XL");
                num -= 40;
            } else if (num >= 10) {
                stringBuilder.append('X');
                num -= 10;
            } else if (num >= 9) {
                stringBuilder.append("IX");
                num -= 9;
            } else if (num >= 5) {
                stringBuilder.append('V');
                num -= 5;
            } else if (num >= 4) {
                stringBuilder.append("IV");
                num -= 4;
            } else {
                stringBuilder.append('I');
                num -= 1;
            }
        }
        return stringBuilder.toString();
    }
}
```

## [13. 罗马数字转整数](https://leetcode-cn.com/problems/roman-to-integer/)

```java
class Solution {
    public int romanToInt(String s) {
        Map<Character,Integer> romanNumMap=new HashMap<>();
        romanNumMap.put('I',1);
        romanNumMap.put('V',5);
        romanNumMap.put('X',10);
        romanNumMap.put('L',50);
        romanNumMap.put('C',100);
        romanNumMap.put('D',500);
        romanNumMap.put('M',1000);
        
        int num=0;
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; ) {
            if(i<chars.length-1){
                if(romanNumMap.get(chars[i])>=romanNumMap.get(chars[i+1])){
                    num+=romanNumMap.get(chars[i++]);
                }else{
                    num+=(romanNumMap.get(chars[i+1])-romanNumMap.get(chars[i]));
                    i+=2;
                }
            }else{
                num+=romanNumMap.get(chars[i++]);
            }
        }
        return num;
    }
}
```

代码优化：

```java
class Solution {
    public int romanToInt(String s) {
        Map<Character,Integer> romanNumMap=new HashMap<>();
        romanNumMap.put('I',1);
        romanNumMap.put('V',5);
        romanNumMap.put('X',10);
        romanNumMap.put('L',50);
        romanNumMap.put('C',100);
        romanNumMap.put('D',500);
        romanNumMap.put('M',1000);
        
        int num=0;
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; ) {
            if(i<chars.length-1 && romanNumMap.get(chars[i])<romanNumMap.get(chars[i+1])){
                num+=(romanNumMap.get(chars[i+1])-romanNumMap.get(chars[i]));
                i+=2;
            }else{
                num+=romanNumMap.get(chars[i++]);
            }
        }
        return num;
    }
}
```

时间与内存优化：

```java
class Solution {
    public int romanToInt(String s) {
        int num=0;
        int preVal=getRomanValue(s.charAt(0));
        for (int i = 1; i<s.length(); i++) {
            int nowVal=getRomanValue(s.charAt(i));
            if(preVal>=nowVal) num+=preVal;
            else num-=preVal;
            preVal=nowVal;
        }
        return num+preVal;
    }

    public int getRomanValue(char roman){
        switch (roman){
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: return 0;
        }
    }
}
```

## [461. 汉明距离](https://leetcode-cn.com/problems/hamming-distance/)

方法：暴力

```java
class Solution {
    public int hammingDistance(int x, int y) {
        int num=0;
        String xBits = Integer.toBinaryString(x);
        String yBits = Integer.toBinaryString(y);
        for(int i=xBits.length()-1,j=yBits.length()-1;i>=0||j>=0;i--,j--){
            if(i>=0 && j>=0){
                if(xBits.charAt(i)!=yBits.charAt(j)) num++;
            }else if(i>=0){
                if(xBits.charAt(i)=='1') num++;
            }else if(yBits.charAt(j)=='1') {
                num++;
            }
        }
        return num;
    }
}
```

方法二：

```java
/**
16%2=0     16/2=8
8%2=0       8/2=4
4%2=0       4/2=2
2%2=0       2/2=1
1%2=1       1/2=0
16的二进制数：1,0000
**/
class Solution {
    public int hammingDistance(int x, int y) {
        int num=0;
        while(x>0 || y>0){
            if(x%2!=y%2) num++;
            x/=2;
            y/=2;
        }
        return num;
    }
}
```



## [477. 汉明距离总和](https://leetcode-cn.com/problems/total-hamming-distance/)

方法一：
暴力法，超时
```java
class Solution {
    public int totalHammingDistance(int[] nums) {
        int total=0;
        for(int i=0;i<nums.length-1;i++){
            for(int j=i+1;j<nums.length;j++){
                total+=hammingDistance(nums[i],nums[j]);
            }
        }
        return total;
    }

    public int hammingDistance(int x,int y){
        int num=0;
        while(x>0 || y>0){
            if(x%2!=y%2) num++;
            x/=2;
            y/=2;
        }
        return num;
    }
}
```


## [2. 两数相加](https://leetcode-cn.com/problems/add-two-numbers/)

方法：模拟加法运算
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        boolean carry=false;   //进位
        ListNode head=new ListNode(0);
        ListNode cur=head;
        while(l1!=null && l2!=null){
            int num=l1.val+l2.val;
            if(num>9){
                num%=10;
                if(carry) num++;
                cur.next=new ListNode(num);
                cur=cur.next;
                carry=true;
            }else{
                if(carry){
                    if(++num>9){
                        num%=10;
                        cur.next=new ListNode(num);
                        cur=cur.next;
                    }else{
                        cur.next=new ListNode(num);
                        cur=cur.next;
                        carry=false;
                    }

                }else{
                    cur.next=new ListNode(num);
                    cur=cur.next;
                }
            }
            l1=l1.next;
            l2=l2.next;
        }
        while(l1!=null){
            if(carry){
                int num=l1.val+1;
                if(num>9){
                    num%=10;
                }else{
                    carry=false;
                }
                cur.next=new ListNode(num);
                cur=cur.next;
            }else{
                cur.next=new ListNode(l1.val);
                cur=cur.next;
            }
            l1=l1.next;
        }

        while(l2!=null){
            if(carry){
                int num=l2.val+1;
                if(num>9){
                    num%=10;
                }else{
                    carry=false;
                }
                cur.next=new ListNode(num);
                cur=cur.next;
            }else{
                cur.next=new ListNode(l2.val);
                cur=cur.next;
            }
            l2=l2.next;
        }

        if(carry){
            cur.next=new ListNode(1);
            cur=cur.next;
            carry=false;
        }
        return head.next;
    }
}
```

## [168. Excel表列名称](https://leetcode-cn.com/problems/excel-sheet-column-title/)

```java
class Solution {
    public String convertToTitle(int columnNumber) {
        StringBuilder stringBuilder=new StringBuilder();
        while(columnNumber>0){
            int remainder = (columnNumber-1) % 26;
            stringBuilder.insert(0,(char)(remainder+65));
            columnNumber=(columnNumber-remainder+1)/26;
        }
        return stringBuilder.toString();

    }
}
```

## [171. Excel 表列序号](https://leetcode-cn.com/problems/excel-sheet-column-number/)

数学26进制

```java
class Solution {
    public int titleToNumber(String columnTitle) {
        int num=0;
        for (char c : columnTitle.toCharArray()) {
            num*=26;
            num+=(c-'A'+1);
        }
        return num;
    }
}
```

## [292. Nim 游戏](https://leetcode-cn.com/problems/nim-game/)

方法：**巴什博弈(Bash Game)**

**问题：** 只有一堆n个物品，两个人轮流从这堆物品中取物，规定每次至少取一个，最多取m个，最后取光者得胜。

**思路：** 专注于决胜局，即最后只有m+1个物品。面临决胜局，先取者输，后取者赢。

**解决：** 设在决胜局前进行了r轮对决， $n=(m+1)*r+s$ ，其中 $0<=s<=m$ ，当 $s=0$ 时，先取者输，反之先取者赢。优化得：若 $n\%(m+1)=0$ ，先取者输，反之先取者赢。

```java
class Solution {
    public boolean canWinNim(int n) {
        return n%4!=0;
    }
}
```











# 哈希表

## [217. 存在重复元素](https://leetcode-cn.com/problems/contains-duplicate/)

方法一：排序

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Arrays.sort(nums);
        boolean res=false;
        for(int i=1;i<nums.length;i++){
            if(nums[i-1]==nums[i]){
                res=true;
                break;
            }
        }
        return res;
    }
}
```

方法二：使用Set，维持一个size=nums.length的滑动窗

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> numSet=new HashSet<Integer>();
        numSet.add(nums[0]);
        for(int i=1;i<nums.length;i++) {
        	if(numSet.contains(nums[i])) {
        		return true;
        	}else {
        		numSet.add(nums[i]);
        	}
        }
        return false;
    }
}

```



## [219. 存在重复元素 II](https://leetcode-cn.com/problems/contains-duplicate-ii/)

方法一：使用Map

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer,List<Integer>> numMap=new HashMap<>();   //key:nums[i]   value:i
        List<Integer> list=new ArrayList<>();
        list.add(0);
        numMap.put(nums[0],list);
        for(int i=1;i<nums.length;i++){
            if(numMap.containsKey(nums[i])) {
            	list=numMap.get(nums[i]);
            	if(Math.abs(i-list.get(0))<=k) {
            		return true;
            	}else {
            		list.add(0,i);
            		numMap.replace(nums[i], list);
            	}
            }else {
            	list=new ArrayList<>();
            	list.add(i);
            	numMap.put(nums[i], list);
            }
        }
        return false;
    }
}
```

优化版：

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer,Integer> numMap=new HashMap<>();   //key:nums[i]   value:i
        numMap.put(nums[0],0);
        for(int i=1;i<nums.length;i++){
            if(numMap.containsKey(nums[i])) {
            	int val=numMap.get(nums[i]);
            	if(Math.abs(i-val)<=k) {
            		return true;
            	}else {
            		numMap.replace(nums[i], i);
            	}
            }else {
            	numMap.put(nums[i], i);
            }
        }
        return false;
    }
}
```

再优化空间复杂度，使用Set，维持一个size=k的滑动窗

```java
class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        Set<Integer> numSet=new HashSet<>();
        for(int i=0;i<nums.length;i++) {
            if(numSet.contains(nums[i])) return true;
            numSet.add(nums[i]);
            if(numSet.size()>k) {
                numSet.remove(nums[i-k]);
            }
        }
        return false;
    }
}
```

## [220. 存在重复元素 III](https://leetcode-cn.com/problems/contains-duplicate-iii/)

方法一：维持一个size=k的滑动窗，超时

```java
class Solution {
    public boolean containsNearbyAlmostDuplicate(int[] nums, int k, int t) {
        if(k<=0) return false;
        int slideWinStart=0;
        
        for(int i=1;i<nums.length;i++) {
        	for(int j=slideWinStart;j<i;j++) {
                System.out.println(Math.abs((long) nums[i]-(long) nums[j]));
        		if(Math.abs((long) nums[i]-(long) nums[j])<=t) {
                    return true;
                }
        	}
        	if((i-slideWinStart)>=k) {
        		slideWinStart++;
        	}
        }
        return false;
    }
}
```



## [771. 宝石与石头](https://leetcode-cn.com/problems/jewels-and-stones/)

```java
class Solution {
    public int numJewelsInStones(String jewels, String stones) {
        int num=0;
        Set<Character> set=new HashSet<>();
        for(char c:jewels.toCharArray())
            set.add(c);
        for(char c:stones.toCharArray())
            if(set.contains(c)) num++;
        return num;
    }
}
```



## [136. 只出现一次的数字](https://leetcode-cn.com/problems/single-number/)

方法一：hash表

```java
class Solution {
    public int singleNumber(int[] nums) {
        Set<Integer> set=new HashSet<>();
        set.add(nums[0]);
        for(int i=1;i<nums.length;i++){
            if(!set.add(nums[i])) {
                set.remove(nums[i]);
            }
        }
        for (Integer integer : set) {
            return integer;
        }
        return 0;  //多余
    }
}
```

方法二：异或



## [1805. 字符串中不同整数的数目](https://leetcode-cn.com/problems/number-of-different-integers-in-a-string/)

```java
class Solution {
    public int numDifferentIntegers(String word) {
        Set<String> set=new HashSet<>();
        int len=word.length();
        int start=0;
        int end;
        int i=0;
        while(i<len){
            while(i<len && word.charAt(i)>='a' && word.charAt(i)<='z'){
                start++;
                i++;
            }
            end=start;
            while(i<len && word.charAt(i)>='0' && word.charAt(i)<='9'){
                end++;
                i++;
            }
            if(end>start){
                String numWord=word.substring(start,end);
                int j=0;
                while(j<numWord.length() && numWord.charAt(j)=='0'){
                    j++;
                }
                set.add(numWord.substring(j));
            }
            start=end;
        }
        return set.size();

    }
}
```



## [1832. 判断句子是否为全字母句](https://leetcode-cn.com/problems/check-if-the-sentence-is-pangram/)

```java
class Solution {
    public boolean checkIfPangram(String sentence) {
        if(sentence.length()<26) return false;
        Set<Character> set=new HashSet<>();
        for (char c : sentence.toCharArray()) {
            set.add(c);
        }
        return set.size()==26;
    }
}
```

## [1748. 唯一元素的和](https://leetcode-cn.com/problems/sum-of-unique-elements/)

方法：暴力

```java
class Solution {
    public int sumOfUnique(int[] nums) {
        Map<Integer,Boolean> map=new HashMap<>();
        for (int i=0;i<nums.length;i++) {
            if(map.containsKey(nums[i])) map.replace(nums[i],false);
            else map.put(nums[i],true);
        }
        int sum=0;
        for(int i=0;i<nums.length;i++){
            if(map.get(nums[i])) sum+=nums[i];
        }
        return sum;
    }
}
```

方法二：根据提示：

- `1 <= nums.length <= 100`
- `1 <= nums[i] <= 100`

```java
class Solution {
    public int sumOfUnique(int[] nums) {
        int sum=0;
        int[] count=new int[100];
        for (int num : nums) {
            ++count[num-1];
        }
        for(int i=0;i<100;i++){
            if(count[i]==1) sum+=(i+1);
        }
        return sum;
    }
}
```



## [160. 相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)

方法一：哈希表法

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        Set<ListNode> set=new HashSet<>();
        while(headA!=null){
            set.add(headA);
            headA=headA.next;
        }
        while(headB!=null){
            if(set.contains(headB)) return headB;
            headB=headB.next;
        }
        return null;
    }
}
```

方法二：

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode indexA=headA;
        ListNode indexB=headB;
        boolean flagA=false;
        boolean flagB=false;

        while(indexA!=null && indexB!=null){
            if(indexA==indexB) return indexA;

            if(indexA.next==null && !flagA){
                indexA=headB;
                flagA=true;
            }else{
                indexA=indexA.next;
            }

            if(indexB.next==null && !flagB){
                indexB=headA;
                flagB=true;
            }else{
                indexB=indexB.next;
            }
        }
        
        return null;
    }
}
```

## [1418. 点菜展示表](https://leetcode-cn.com/problems/display-table-of-food-orders-in-a-restaurant/)

![image-20210706200620145](D:\blog\source\_drafts\leetcode刷题\8.png)

```java
class Solution {
    public List<List<String>> displayTable(List<List<String>> orders) {
        List<List<String>> res=new ArrayList<>();

        //菜单列表
        Set<String> foodList=new TreeSet<>();
        for (List<String> order : orders) {
            foodList.add(order.get(2));
        }

        //Map<Integer,Map>    Integer: 桌号
        //Map<String,Integer>      String: 菜名     Integer: 数量
        Map<Integer,Map<String,Integer>> tableList=new TreeMap<>();
        for (List<String> order : orders) {
            if(tableList.containsKey(Integer.parseInt(order.get(1)))){
                Map<String, Integer> menuMap = tableList.get(Integer.parseInt(order.get(1)));
                menuMap.replace(order.get(2),menuMap.get(order.get(2))+1);
            }else{
                Map<String,Integer> menuMap=new HashMap<>();
                for (String food : foodList) {
                    menuMap.put(food,0);
                }
                menuMap.replace(order.get(2),1);
                tableList.put(Integer.parseInt(order.get(1)),menuMap);
            }
        }

        List<String> headList=new ArrayList<>(foodList);
        headList.add(0,"Table");
        res.add(headList);
        
        for (Integer tableNum : tableList.keySet()) {
            List<String> orderList=new ArrayList<>();
            orderList.add(tableNum+"");
            
            Map<String,Integer> orderMap=tableList.get(tableNum);
            for (String food : foodList) {
                orderList.add(orderMap.get(food)+"");
            }
            res.add(orderList);
        }
        
        return res;
    }
}
```



## [面试题 10.02. 变位词组](https://leetcode-cn.com/problems/group-anagrams-lcci/)

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        List<List<String>> res=new ArrayList<>();
        Map<String,List<String>> map=new HashMap<>();
        for (String str : strs) {
            int[] keyArray=new int[26];
            for (char c : str.toCharArray()) {
                keyArray[c-'a']++;
            }
            StringBuilder sb=new StringBuilder();
            for (int i : keyArray) {
                sb.append(i+"_");
            }
            String key=sb.toString();
            List<String> list = map.getOrDefault(key, new ArrayList<>());
            list.add(str);
            map.put(key,list);
        }
        for (String s : map.keySet()) {
            res.add(map.get(s));
        }
        return res;
    }
}
```

## [763. 划分字母区间](https://leetcode-cn.com/problems/partition-labels/)

```java
class Solution {
    public List<Integer> partitionLabels(String s) {
        List<Integer> res=new ArrayList<>();
        Map<Character,Integer> map=new HashMap<>();   //记录char c 和其最后出现位置的 map
        for (int i = 0; i < s.length(); i++) {
            map.put(s.charAt(i),i);
        }
        int max=-1;
        int l=-1;
        for (int i = 0; i < s.length(); i++) {
            max=Math.max(map.get(s.charAt(i)),max);
            if(i>=max){
                res.add(i-l);
                l=i;
            }
        }
        return res;
    }
}
```

优化版：

```java
class Solution {
    public List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        int length = s.length();
        for (int i = 0; i < length; i++) {
            last[s.charAt(i) - 'a'] = i;
        }
        List<Integer> partition = new ArrayList<Integer>();
        int start = 0, end = 0;
        for (int i = 0; i < length; i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                partition.add(end - start + 1);
                start = end + 1;
            }
        }
        return partition;
    }
}
```

## [447. 回旋镖的数量](https://leetcode-cn.com/problems/number-of-boomerangs/)

```java
class Solution {
    public int numberOfBoomerangs(int[][] points) {
        int num=0;
        for (int i = 0; i < points.length; i++) {
            Map<Integer,Integer> map=new HashMap<>();
            for(int j=0; j<points.length;j++){
                if(j==i) continue;
                int distance=(int) Math.pow((points[j][0]-points[i][0]),2)+(int) Math.pow((points[j][1]-points[i][1]),2);
                map.put(distance,map.getOrDefault(distance,0)+1);
            }
            for (Integer d : map.keySet()) {
                int n=map.get(d);
                num+=(n*(n-1));
            }
        }
        return num;
    }
}
```

优化：

```java
class Solution {
    public int numberOfBoomerangs(int[][] points) {
        int num=0;
        for (int i = 0; i < points.length; i++) {
            Map<Double,Integer> map=new HashMap<>();
            for(int j=0; j<points.length;j++){
                if(j==i) continue;
                double distance=Math.pow((points[j][0]-points[i][0]),2)+Math.pow((points[j][1]-points[i][1]),2);
                map.put(distance,map.getOrDefault(distance,0)+1);
            }
            for (double d : map.keySet()) {
                int n=map.get(d);
                num+=(n*(n-1));
            }
        }
        return num;
    }
}
```

## [146. LRU 缓存机制](https://leetcode-cn.com/problems/lru-cache/)

方法一：

```java
public class LRUCache extends LinkedHashMap<Integer,Integer> {

    private int capacity;


    public LRUCache(int capacity) {
        super(capacity,0.75F,true);
        this.capacity=capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key,-1);
    }

    public void put(int key, int value) {
        super.put(key,value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return super.size()>capacity;
    }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
```









# 栈

## [1021. 删除最外层的括号](https://leetcode-cn.com/problems/remove-outermost-parentheses/)

```java
class Solution {
    public String removeOuterParentheses(String S) {
        Stack<Character> stack=new Stack<>();
        StringBuilder stringBuilder=new StringBuilder();
        for (int i=0;i<S.length();i++) {
            if(S.charAt(i)=='('){
                if(!stack.empty()) stringBuilder.append(S.charAt(i));
                stack.push(S.charAt(i));
            }else if(S.charAt(i)==')'){
                stack.pop();
                if(!stack.empty()) stringBuilder.append(S.charAt(i));
            }else{
                stringBuilder.append(S.charAt(i));
            }
        }
        return stringBuilder.toString();
    }
}
```

优化版：

```java
class Solution {
    public String removeOuterParentheses(String S) {
        StringBuilder stringBuilder=new StringBuilder();
        int level=0;   //当level归0时，即外括号
        for (char c : S.toCharArray()) {
            if(c=='('){
                if(level++>0) stringBuilder.append(c);
            }else if(c==')'){
                if(--level>0) stringBuilder.append(c);
            }else{
                stringBuilder.append(c);
            }
        }
        return stringBuilder.toString();
    }
}
```

再简洁版：

```java
class Solution {
    public String removeOuterParentheses(String S) {
        StringBuilder stringBuilder=new StringBuilder();
        int level=0;   //当level归0时，即外括号
        for (char c : S.toCharArray()) {
            if(c==')') level--;  
            if(level>0) stringBuilder.append(c);
            if(c=='(') level++;
        }
        return stringBuilder.toString();
    }
}
```



## [1047. 删除字符串中的所有相邻重复项](https://leetcode-cn.com/problems/remove-all-adjacent-duplicates-in-string/)

```java
class Solution {
    public String removeDuplicates(String S) {
        Stack<Character> stack=new Stack<>();
        for (char c : S.toCharArray()) {
            if(stack.empty()) stack.push(c);
            else if(stack.peek()!=c) stack.push(c);
            else stack.pop();
        }
        StringBuilder stringBuilder=new StringBuilder();
        while(!stack.empty()){
            stringBuilder.insert(0,stack.pop());
        }
        return stringBuilder.toString();
    }
}
```

优化版：

```java
class Solution {
    public String removeDuplicates(String S) {
        StringBuilder stack=new StringBuilder();
        for (char c : S.toCharArray()) {
            if(stack.length()==0) stack.append(c);
            else if(stack.charAt(stack.length()-1)!=c) stack.append(c);
            else stack.deleteCharAt(stack.length()-1);
        }
        return stack.toString();
    }
}
```

## [1614. 括号的最大嵌套深度](https://leetcode-cn.com/problems/maximum-nesting-depth-of-the-parentheses/)

```java
class Solution {
    public int maxDepth(String s) {
        Stack<Character> stack=new Stack<>();
        int depth=0;
        for (char c : s.toCharArray()) {
            if(c=='(') stack.push(c);
            else if(c==')'){
                if(stack.size()>depth) depth=stack.size();
                stack.pop();
            }
        }
        return depth;
    }
}
```

用数组模拟栈：

```java
class Solution {
    public int maxDepth(String s) {
        char[] stack=new char[s.length()];
        int head=0;   
        int depth=0;
        for (char c : s.toCharArray()) {
            if(c=='(') stack[head++]=c;
            else if(c==')'){
                if(head>depth) depth=head;
                head--;
            }
        }
        return depth;
    }
}
```

## [496. 下一个更大元素 I](https://leetcode-cn.com/problems/next-greater-element-i/)

方法一：用HashMap，然后暴力

```java
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        int[] res=new int[nums1.length];
        Map<Integer,Integer> map=new HashMap<>();
        for (int i = 0; i < nums2.length; i++) {
            map.put(nums2[i],i);
        }
        for (int i = 0; i < nums1.length; i++) {
            int index=map.get(nums1[i])+1;
            boolean bigger=false;
            for(;index<nums2.length;index++){
                if(nums2[index]>nums1[i]) {
                    res[i]=nums2[index];
                    bigger=true;
                    break;
                }
            }
            if(!bigger) res[i]=-1;
        }
        return res;
    }
}
```

方法二：单调栈+HashMap

```java
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Stack<Integer> stack=new Stack<>();
        Map<Integer,Integer> map=new HashMap<>();
        
        for (int num : nums2) {
            while(!stack.empty() && num>stack.peek()){
                map.put(stack.pop(),num);
            }
            stack.push(num);
        }
        while(!stack.empty()){
            map.put(stack.pop(),-1);
        }

        int[] res=new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            res[i]=map.get(nums1[i]);
        }
        return res;
    }
}
```

优化版：

```java
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Stack<Integer> stack=new Stack<>();
        Map<Integer,Integer> map=new HashMap<>();

        for (int num : nums2) {
            while (!stack.empty() && num > stack.peek()) {
                map.put(stack.pop(), num);
            }
            stack.push(num);
        }

        for (int i = 0; i < nums1.length; i++) {
            nums1[i] = map.getOrDefault(nums1[i], -1);
        }
        return nums1;
    }
}
```

## [503. 下一个更大元素 II](https://leetcode-cn.com/problems/next-greater-element-ii/)

单调栈，在这里单调栈记录的是数组的位置

```java
class Solution {
    public int[] nextGreaterElements(int[] nums) {
        int len = nums.length;
        int[] res = new int[len];
        Arrays.fill(res, -1);
        Stack<Integer> stack = new Stack<>();
        for (int i = 0; i < len * 2; i++) {
            while (!stack.empty() && nums[i % len] > nums[stack.peek()]) {
                res[stack.pop()] = nums[i % len];
            }
            stack.push(i % len);
        }
        return res;
    }
}
```

## [739. 每日温度](https://leetcode-cn.com/problems/daily-temperatures/)

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int[] res=new int[temperatures.length];
        Stack<Integer> stack=new Stack<>();
        for (int i = 0; i < temperatures.length; i++) {
            while(!stack.empty() && temperatures[i]>temperatures[stack.peek()]){
                res[stack.peek()]=i-stack.pop();
            }
            stack.push(i);
        }
        return res;
    }
}
```



## [901. 股票价格跨度](https://leetcode-cn.com/problems/online-stock-span/)

方法一：暴力法

```java
class StockSpanner {

    List<Integer> prices;

    public StockSpanner() {
        prices=new ArrayList<>();
    }
    
    public int next(int price) {
        int res=1;
        int i=prices.size()-1;
        while(i>=0 && price>=prices.get(i)){
            i--;
            res++;
        }
        prices.add(price);
        return res;
    }
}

/**
 * Your StockSpanner object will be instantiated and called as such:
 * StockSpanner obj = new StockSpanner();
 * int param_1 = obj.next(price);
 */
```



## [20. 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

```java
class Solution {
    public boolean isValid(String s) {
        char[] stack=new char[s.length()/2];
        int index=-1;
        for(char c:s.toCharArray()){
            switch (c){
                case '(':
                case '{':
                case '[':{
                    if(++index==stack.length) return false;
                    stack[index]=c;
                    break;
                }
                case ')':{
                    if(index>=0 && stack[index]=='('){
                        index--;
                        break;
                    }
                    else return false;
                }
                case '}':{
                    if(index>=0 && stack[index]=='{'){
                        index--;
                        break;
                    }
                    else return false;
                }
                case ']':{
                    if(index>=0 && stack[index]=='['){
                        index--;
                        break;
                    }
                    else return false;
                }
            }
        }
        return index==-1;
    }
}
```



## [155. 最小栈](https://leetcode-cn.com/problems/min-stack/)

方法：建立数据栈和辅助栈

```java
class MinStack {

    private Stack<Integer> dataStack;
    private Stack<Integer> minStack;
    
    
    /** initialize your data structure here. */
    public MinStack() {
        dataStack=new Stack<>();
        minStack=new Stack<>();
    }
    
    public void push(int val) {
        dataStack.push(val);
        if(minStack.empty()) minStack.push(val);
        else if(minStack.peek()>=val) minStack.push(val);
    }
    
    public void pop() {
        if(dataStack.peek().equals(minStack.peek())){
            minStack.pop();
        }
        dataStack.pop();
        System.out.println(minStack.size());
    }
    
    public int top() {
        return dataStack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * MinStack obj = new MinStack();
 * obj.push(val);
 * obj.pop();
 * int param_3 = obj.top();
 * int param_4 = obj.getMin();
 */
```

## [1441. 用栈操作构建数组](https://leetcode-cn.com/problems/build-an-array-with-stack-operations/)

难度：读懂题目

```java
class Solution {
    public List<String> buildArray(int[] target, int n) {
        List<String> list=new ArrayList<>();
    
        for(int i=1,j=0;i<=n && j<target.length;i++){
            list.add("Push");
            if(i!=target[j]) list.add("Pop");
            else j++;
        }
        return list;
    }
}
```



## [844. 比较含退格的字符串](https://leetcode-cn.com/problems/backspace-string-compare/)

```java
class Solution {
    public boolean backspaceCompare(String s, String t) {
        char[] stack1=new char[s.length()];
        int index1=-1;
        char[] stack2=new char[t.length()];
        int index2=-1;
        
        for (char c : s.toCharArray()) {
            if(c!='#'){
                stack1[++index1]=c;
            }else if(index1>-1){
                index1--;
            }
        }
        for (char c : t.toCharArray()) {
            if(c!='#'){
                stack2[++index2]=c;
            }else if(index2>-1){
                index2--;
            }
        }
        if(index1!=index2) return false;
        else{
            for(int i=0;i<=index1;i++){
                if(stack1[i]!=stack2[i]) return false;
            }
            return true;
        }
    }
}
```

## [232. 用栈实现队列](https://leetcode-cn.com/problems/implement-queue-using-stacks/)

```java
class MyQueue {

    private Stack<Integer> dataStack;
    private Stack<Integer> helpStack;

    /** Initialize your data structure here. */
    public MyQueue() {
        dataStack=new Stack<>();
        helpStack=new Stack<>();
    }
    
    /** Push element x to the back of queue. */
    public void push(int x) {
        while(!dataStack.empty()){
            helpStack.push(dataStack.pop());
        }
        dataStack.push(x);
        while(!helpStack.empty()){
            dataStack.push(helpStack.pop());
        }
    }
    
    /** Removes the element from in front of queue and returns that element. */
    public int pop() {
        return dataStack.pop();
    }
    
    /** Get the front element. */
    public int peek() {
        return dataStack.peek();
    }
    
    /** Returns whether the queue is empty. */
    public boolean empty() {
        return dataStack.empty();
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * MyQueue obj = new MyQueue();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.peek();
 * boolean param_4 = obj.empty();
 */
```



## [1190. 反转每对括号间的子串](https://leetcode-cn.com/problems/reverse-substrings-between-each-pair-of-parentheses/)

```java
class Solution {
    public String reverseParentheses(String s) {
        Stack<Character> stack=new Stack<>();
        for (char c : s.toCharArray()) {
            if(c!=')') stack.push(c);
            else{
                StringBuilder temp= new StringBuilder();
                while (stack.peek()!='('){
                    temp.append(stack.pop());
                }
                stack.pop();
                for(int i=0;i<temp.length();i++){
                    stack.push(temp.charAt(i));
                }
            }
        }
        StringBuilder stringBuilder=new StringBuilder();
        while(!stack.empty()) stringBuilder.insert(0,stack.pop());
        return stringBuilder.toString();
    }
}
```

## [1598. 文件夹操作日志搜集器](https://leetcode-cn.com/problems/crawler-log-folder/)

```java
class Solution {
    public int minOperations(String[] logs) {
        int index=0;
        for(String log:logs){
            if(log.equals("../")){
                if(index>0) --index;
            } 
            else if(log.equals("./")) continue;
            else ++index;
        }
        return index;
    }
}
```

## [1019. 链表中的下一个更大节点](https://leetcode-cn.com/problems/next-greater-node-in-linked-list/)

方法一：将链表转化为数组

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public int[] nextLargerNodes(ListNode head) {
        List<Integer> list=new ArrayList<>();
        while(head!=null) {
            list.add(head.val);
            head=head.next;
        }
        Integer[] array = new Integer[list.size()];
        list.toArray(array);

        int[] res=new int[array.length];
        Stack<Integer> stack=new Stack<>();

        for(int i=0;i<array.length;i++){
            while(!stack.empty() && array[i]>array[stack.peek()]){
                res[stack.pop()]=array[i];
            }
            stack.push(i);
        }
        return res;

    }
}
```

## [143. 重排链表](https://leetcode-cn.com/problems/reorder-list/)

方法：一头一尾取元素

```
1 -> 2 -> 3 -> 4 -> 5 -> 6
第一步，将链表平均分成两半
1 -> 2 -> 3
4 -> 5 -> 6
    
第二步，将第二个链表逆序
1 -> 2 -> 3
6 -> 5 -> 4
    
第三步，依次连接两个链表
1 -> 6 -> 2 -> 5 -> 3 -> 4
```

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public void reorderList(ListNode head) {
        //将链表分为两部分
        if(head==null) return ;
        ListNode front=head,end=head.next;
        while(end!=null && end.next!=null){
            front=front.next;
            end=end.next.next;
        }

        //将后部分的链表放入栈中
        Stack<ListNode> stack=new Stack<>();
        ListNode p=front.next;
        while(p!=null){
            stack.push(p);
            p=p.next;
        }
        
        //对前后部分的链表进行断开
        front.next=null;
        
        //一头一尾取元素
        front=head;
        while(front!=null){
            ListNode nextTemp=front.next;

            ListNode node=null;
            if(!stack.empty()){
                node=stack.pop();
            }
            
            front.next=node;
            front=front.next;
            if(front!=null){
                front.next=nextTemp;
                front=front.next;
            }
        }
    }
}
```

优化：

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public void reorderList(ListNode head) {
        //将链表分为两部分
        if(head==null) return ;
        ListNode p1=head,p2=head.next;
        while(p2!=null && p2.next!=null){
            p1=p1.next;
            p2=p2.next.next;
        }

        //将后部分的链表放入栈中
        Stack<ListNode> stack=new Stack<>();
        p2=p1.next;
        while(p2!=null){
            stack.push(p2);
            p2=p2.next;
        }
        
        //对前后部分的链表进行断开
        p1.next=null;
        
        //一头一尾取元素
        p1=head;
        while(p1!=null){
            ListNode nextTemp=p1.next;
            p2=null;
            if(!stack.empty()){
                p2=stack.pop();
            }
            p1.next=p2;
            p1=p1.next;
            if(p1!=null){
                p1.next=nextTemp;
                p1=p1.next;
            }
        }
    }
}
```

## [150. 逆波兰表达式求值](https://leetcode-cn.com/problems/evaluate-reverse-polish-notation/)

```java
class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> numStack=new Stack<>();

        for(String str:tokens){
            if(str.equals("+") || str.equals("-") || str.equals("*") || str.equals("/")){
                int num1=numStack.pop();
                int num2=numStack.pop();
                if(str.equals("+")){
                    num2+=num1;
                }else if(str.equals("-")){
                    num2-=num1;
                }else if(str.equals("*")){
                    num2*=num1;
                }else{
                    num2/=num1;
                }
                numStack.push(num2);
            }else{
                numStack.push(Integer.parseInt(str));
            }
        }

        return numStack.pop();
    }
}
```

## [394. 字符串解码](https://leetcode-cn.com/problems/decode-string/)

```java
class Solution {
    public String decodeString(String s) {
        StringBuilder res=new StringBuilder();
        Stack<Integer> numStack=new Stack<>();
        Stack<String> strStack=new Stack<>();

        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; ) {
            if(isNumber(chars[i])){
                StringBuilder numStr= new StringBuilder();
                numStr.append(chars[i++]);
                while(i<chars.length && isNumber(chars[i])){
                    numStr.append(chars[i++]);
                }
                numStack.push(Integer.parseInt(numStr.toString()));

            }else if(chars[i]=='['){
                StringBuilder str=new StringBuilder();
                i++;
                while(i<chars.length && !isNumber(chars[i]) && chars[i]!='[' && chars[i]!=']'){
                    str.append(chars[i++]);
                }
                strStack.push(str.toString());

            }else if(chars[i]==']'){
                String str = strStack.pop();
                StringBuilder strBuilder=new StringBuilder();
                int num=numStack.pop();
                while(num>0){
                    strBuilder.append(str);
                    num--;
                }
                if(numStack.empty()){
                    res.append(strBuilder);
                }else {
                    strStack.push(strStack.pop()+ strBuilder);
                }
                i++;

            }else{
                StringBuilder strBuilder=new StringBuilder();
                strBuilder.append(chars[i++]);            
                while(i<chars.length && !isNumber(chars[i]) && chars[i]!='[' && chars[i]!=']'){
                    strBuilder.append(chars[i++]);
                }

                if(numStack.empty()){
                    res.append(strBuilder);
                }else{
                    strStack.push(strStack.pop()+strBuilder);
                }
            }
        }
        return res.toString();
    }

    public boolean isNumber(char c){
        return c>='0' && c<='9';
    }
}
```

## [445. 两数相加 II](https://leetcode-cn.com/problems/add-two-numbers-ii/)

方法一：三个栈

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Stack<Integer> num1Stack=new Stack<>();
        Stack<Integer> num2Stack=new Stack<>();
        Stack<Integer> resStack=new Stack<>();

        while(l1!=null){
            num1Stack.push(l1.val);
            l1=l1.next;
        }
        while(l2!=null){
            num2Stack.push(l2.val);
            l2=l2.next;
        }

        boolean carry=false;
        while(!num1Stack.empty() && !num2Stack.empty()){
            int num=num1Stack.pop()+num2Stack.pop();
            if(carry){
                ++num;
                carry=false;
            }
            if(num>9){
                num%=10;
                carry=true;
            }
            resStack.push(num);
        }

        while(!num1Stack.empty()){
            int num=num1Stack.pop();
            if(carry){
                ++num;
                carry=false;
            }
            if(num>9){
                num%=10;
                carry=true;
            }
            resStack.push(num);
        }

        while(!num2Stack.empty()){
            int num=num2Stack.pop();
            if(carry){
                ++num;
                carry=false;
            }
            if(num>9){
                num%=10;
                carry=true;
            }
            resStack.push(num);
        }

        if(carry){
            resStack.push(1);
            carry=false;
        }

        ListNode res=new ListNode();
        ListNode p=res;
        while(!resStack.empty()){
            p.next=new ListNode(resStack.pop());
            p=p.next;
        }
        return res.next;
    
    }
}
```

优化版：

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Stack<Integer> num1Stack=new Stack<>();
        Stack<Integer> num2Stack=new Stack<>();

        while(l1!=null || l2!=null){
            if(l1!=null){
                num1Stack.push(l1.val);
                l1=l1.next;
            }
            if(l2!=null){
                num2Stack.push(l2.val);
                l2=l2.next;
            }
        }

        ListNode res=new ListNode();

        boolean carry=false;
        while(!num1Stack.empty() || !num2Stack.empty()){
            int num1=0,num2=0;
            if(!num1Stack.empty()) num1=num1Stack.pop();
            if(!num2Stack.empty()) num2=num2Stack.pop();
            int num=num1+num2;
            if(carry){
                ++num;
                carry=false;
            }
            if(num>9){
                num%=10;
                carry=true;
            }

            ListNode node=new ListNode(num);
            node.next=res.next;
            res.next=node;
        }

        if(carry){
            ListNode node=new ListNode(1);
            node.next=res.next;
            res.next=node;
        }

        return res.next;
    }
}
```

## [856. 括号的分数](https://leetcode-cn.com/problems/score-of-parentheses/)

```java
class Solution {
    public int scoreOfParentheses(String s) {
        Stack<Integer> stack=new Stack<>();
        stack.push(0);
        for(char c:s.toCharArray()){
            if(c=='('){
                stack.push(0);
            }else{
                int depth=stack.pop();
                if(depth==0){
                    stack.push(stack.pop()+1);
                }else{
                    stack.push(stack.pop()+depth*2);
                }
            }
        }
        return stack.pop();
    }
}
```

## [1249. 移除无效的括号](https://leetcode-cn.com/problems/minimum-remove-to-make-valid-parentheses/)

```java
class Solution {
    public String minRemoveToMakeValid(String s) {
        Stack<Integer> stack=new Stack<>();
        int i=0;
        while(i<s.length()){
            if(s.charAt(i)=='('){
                stack.push(i);
                i++;
            }else if(s.charAt(i)==')'){
                if(stack.empty()){
                    s=removeCharAt(s,i);
                }else{
                    stack.pop();
                    i++;
                }
            }else{
                i++;
            }
        }

        while(!stack.empty()){
            s=removeCharAt(s,stack.pop());
        }
        return s;
    }
    
    public String removeCharAt(String str,int index){
        return str.substring(0,index)+str.substring(index+1);
    }
}
```

优化版：

```java
class Solution {
    public String minRemoveToMakeValid(String s) {
        StringBuilder res=new StringBuilder(s);
        
        Stack<Integer> stack=new Stack<>();
        int i=0;
        while(i<res.length()){
            if(res.charAt(i)=='('){
                stack.push(i);
                i++;
            }else if(res.charAt(i)==')'){
                if(stack.empty()){
                    res.deleteCharAt(i);
                }else{
                    stack.pop();
                    i++;
                }
            }else{
                i++;
            }
        }

        while(!stack.empty()){
            res.deleteCharAt(stack.pop());
        }
        return res.toString();
    }
}
```

## [636. 函数的独占时间](https://leetcode-cn.com/problems/exclusive-time-of-functions/)

```java
class Solution {
    public int[] exclusiveTime(int n, List<String> logs) {
        int[] res=new int[n];

        //栈数据： int[3]    0-id    1-start    2-rest(中途休息时间)
        Stack<int[]> stack=new Stack<>();
        for (String log : logs) {
            String[] logInfo = log.split(":");
            if(logInfo[1].equals("start")){
                int[] data=new int[3];
                data[0]=Integer.parseInt(logInfo[0]);
                data[1]=Integer.parseInt(logInfo[2]);
                stack.push(data);
            }else{
                int[] data = stack.pop();
                int runTime=Integer.parseInt(logInfo[2])-data[1]-data[2]+1;
                res[data[0]]+=runTime;
                if(!stack.empty()){
                    int[] parentData = stack.pop();
                    parentData[2]+=(Integer.parseInt(logInfo[2])-data[1]+1);
                    stack.push(parentData);
                }
            }
        }
        return res;

    }
}
```

优化版：

```java
class Solution {
    public int[] exclusiveTime(int n, List<String> logs) {
        int[] res=new int[n];

        //栈数据： int[2]    0-start    1-rest(中途休息时间)   
        Stack<int[]> stack=new Stack<>();
        for (String log : logs) {
            String[] logInfo = log.split(":");
            if(logInfo[1].equals("start")){
                int[] data=new int[2];
                data[0]=Integer.parseInt(logInfo[2]);
                stack.push(data);
            }else{
                int[] data = stack.pop();
                int runTime=Integer.parseInt(logInfo[2])-data[0]-data[1]+1;
                res[Integer.parseInt(logInfo[0])]+=runTime;
                if(!stack.empty()){
                    int[] parentData = stack.pop();
                    parentData[1]+=(Integer.parseInt(logInfo[2])-data[0]+1);
                    stack.push(parentData);
                }
            }
        }
        return res;
    }
}
```

## [402. 移掉 K 位数字](https://leetcode-cn.com/problems/remove-k-digits/)

方法一：从左到右，当当前的数比后一个数大时，删去当前的数，删去后要保证是正确的数字。遍历k次

```java
class Solution {
    public String removeKdigits(String num, int k) {
        StringBuilder res=new StringBuilder(num);
        while(k>0 && res.length()>0){
            int i=0;
            for(;i<res.length()-1;i++){
                if(res.charAt(i)>res.charAt(i+1)){
                    break;
                }
            }
            res.deleteCharAt(i);
            i=0;
            while(i<res.length() && res.charAt(i)=='0'){
                res.deleteCharAt(i);
            }
            k--;
        }

        return res.length()>0? res.toString():"0";

    }
}
```

## [1475. 商品折扣后的最终价格](https://leetcode-cn.com/problems/final-prices-with-a-special-discount-in-a-shop/)

方法一：暴力

```java
class Solution {
    public int[] finalPrices(int[] prices) {
        for(int i=0;i<prices.length;i++){
            for(int j=i+1;j<prices.length;j++){
                if(prices[j]<=prices[i]){
                    prices[i]-=prices[j];
                    break;
                }
            }
        }
        return prices;
    }
}
```

## [225. 用队列实现栈](https://leetcode-cn.com/problems/implement-stack-using-queues/)

方法一：两个队列

```java
class MyStack {

    private Queue<Integer> mainQueue,helperQueue;

    /** Initialize your data structure here. */
    public MyStack() {
        mainQueue=new LinkedList<>();
        helperQueue=new LinkedList<>();
    }
    
    /** Push element x onto stack. */
    public void push(int x) {
        while(!mainQueue.isEmpty()){
            helperQueue.offer(mainQueue.poll());
        }
        mainQueue.add(x);
        while(!helperQueue.isEmpty()){
            mainQueue.offer(helperQueue.poll());
        }
    }
    
    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        return mainQueue.poll();
    }
    
    /** Get the top element. */
    public int top() {
        return mainQueue.peek();
    }
    
    /** Returns whether the stack is empty. */
    public boolean empty() {
        return mainQueue.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

方法二：一个队列

```java
class MyStack {

    private Queue<Integer> mainQueue;

    /** Initialize your data structure here. */
    public MyStack() {
        mainQueue=new LinkedList<>();
    }
    
    /** Push element x onto stack. */
    public void push(int x) {
        mainQueue.offer(x);
        int n=mainQueue.size()-1;
        while(n-->0){
            mainQueue.offer(mainQueue.poll());
        }
    }
    
    /** Removes the element on top of the stack and returns that element. */
    public int pop() {
        return mainQueue.poll();
    }
    
    /** Get the top element. */
    public int top() {
        return mainQueue.peek();
    }
    
    /** Returns whether the stack is empty. */
    public boolean empty() {
        return mainQueue.isEmpty();
    }
}

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack obj = new MyStack();
 * obj.push(x);
 * int param_2 = obj.pop();
 * int param_3 = obj.top();
 * boolean param_4 = obj.empty();
 */
```

## [682. 棒球比赛](https://leetcode-cn.com/problems/baseball-game/)

```java
class Solution {
    public int calPoints(String[] ops) {
        int point=0;
        Stack<Integer> stack=new Stack<>();
        for(String op:ops){
            if(op.equals("+")){
                int p1=stack.pop();
                int p2=stack.pop();
                stack.push(p2);
                stack.push(p1);
                int p=p1+p2;
                point+=p;
                stack.push(p);
            }else if(op.equals("D")){
                int p=stack.peek()*2;
                point+=p;
                stack.push(p);
            }else if(op.equals("C")){
                point-=stack.pop();
            }else{
                int p=Integer.parseInt(op);
                point+=p;
                stack.push(p);
            }
        }
        return point;
    }
}
```

## [388. 文件的最长绝对路径](https://leetcode-cn.com/problems/longest-absolute-file-path/)

```java
class Solution {
    public int lengthLongestPath(String input) {
        int len=0;
        int maxLen=0;
        Stack<Integer> stack=new Stack<>();
        String[] inputStrs=input.split("\n");

        for(String str:inputStrs){
            int tabNum=countTab(str);
            while(!stack.empty() && stack.size()>tabNum){
                len-=stack.pop();
            }
            stack.push(str.length()-tabNum+1);
            len+=(str.length()-tabNum+1);
            if(str.contains(".")){
                if(len-1>maxLen){
                    maxLen=len-1;
                }
            }
        }
        return maxLen;
    }

    public int countTab(String str){
        int count=0;
        StringBuilder sb=new StringBuilder("\t");
        while(str.startsWith(sb.toString())){
            count++;
            sb.append("\t");
        }
        return count;
    }
}
```

## [1653. 使字符串平衡的最少删除次数](https://leetcode-cn.com/problems/minimum-deletions-to-make-string-balanced/)

```java
class Solution {
    public int minimumDeletions(String s) {
        int bNum=0,dp=0;
        for(int i=0;i<s.length();i++){
            if(s.charAt(i)=='a'){
                dp=Math.min(dp+1,bNum);
            }
            if(s.charAt(i)=='b'){
                bNum++;
            }
        }
        return dp;
    }
}
```

## [946. 验证栈序列](https://leetcode-cn.com/problems/validate-stack-sequences/)

```java
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        
        Stack<Integer> pushStack=new Stack<>();
        int pushIndex=0;
        int popIndex=0;
        while(pushIndex<pushed.length){
            pushStack.push(pushed[pushIndex++]);
            
            while(!pushStack.isEmpty() && pushStack.peek()==popped[popIndex]){
                pushStack.pop();
                popIndex++;
            }
            
        }
        return pushStack.isEmpty();
    }
}
```

优化版：

```java
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        
        Stack<Integer> pushStack=new Stack<>();
        int popIndex=0;
        for(int p : pushed){
            pushStack.push(p);
            
            while(!pushStack.isEmpty() && pushStack.peek()==popped[popIndex]){
                pushStack.pop();
                ++popIndex;
            }
            
        }
        return pushStack.isEmpty();
    }
}
```

## [678. 有效的括号字符串](https://leetcode-cn.com/problems/valid-parenthesis-string/)

```java
class Solution {
    public boolean checkValidString(String s) {
        Stack<Integer> left=new Stack<>();
        Stack<Integer> star=new Stack<>();
        int i=0;
        for(char c:s.toCharArray()){
            if(c=='('){
                left.push(i++);
                continue;
            }
            if(c=='*'){
                star.push(i++);
                continue;
            }
            if(c==')'){
                if(!left.isEmpty()){
                    left.pop();
                }else if(!star.isEmpty()){
                    star.pop();
                }else{
                    return false;
                }                
                i++;
            }                       
        }
        
        while(!left.isEmpty() && !star.isEmpty()){
            int l=left.pop();
            int st=star.pop();
            if(l>st){
                return false;
            }
            
        }
        return left.isEmpty();
    }
}
```

## [1963. 使字符串平衡的最小交换次数](https://leetcode-cn.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/)

方法：把匹配的全都消了，剩下的必然是 k 个 `]` 加 k 个 `[`，k 为偶数时，交换 k/2 次就能组成 k/2 个 `[]`，k 为奇数时，把左右两端交换后剩下 k-1 个 `]` 加 k-1 个 `[`，再按照偶数来算，最后交换 1 + (k-1)/ 2 次组成 `[[][]...[][]]`

```java
class Solution {
    public int minSwaps(String s) {
        int balance=0;
        Stack<Character> stack=new Stack<>();
        for (char c : s.toCharArray()) {
            if(c=='['){
                stack.push(c);
            }else{
                if(!stack.empty()){
                    stack.pop();
                    balance+=2;
                }
            }
        }
        int unbalance=(s.length()-balance)/2;
        if(unbalance%2==0){
            return unbalance/2;
        }else{
            return 1+(unbalance-1)/2;
        }
    }
}
```

优化版：

```java
class Solution {
    public int minSwaps(String s) {
        int balance=0;
        Stack<Character> stack=new Stack<>();
        for (char c : s.toCharArray()) {
            if(c=='['){
                stack.push(c);
            }else{
                if(!stack.empty()){
                    stack.pop();
                    ++balance;
                }
            }
        }
        int unbalance=s.length()/2-balance;
        return unbalance%2==0? (unbalance/2):(1+(unbalance-1)/2);
    }
}
```

空间优化：

```java
class Solution {
    public int minSwaps(String s) {
        int balance=0;
        int left=0;
        for (char c : s.toCharArray()) {
            if(c=='['){
                left++;
            }else{
                if(left>0){
                    --left;
                    ++balance;
                }
            }
        }
        int unbalance=s.length()/2-balance;
        return unbalance%2==0? (unbalance/2):(1+(unbalance-1)/2);
    }
}
```





# 字符串

## [1816. 截断句子](https://leetcode-cn.com/problems/truncate-sentence/)

方法一：利用Java的String方法

```java
class Solution {
    public String truncateSentence(String s, int k) {
        String[] s1 = s.split(" ");
        if(s1.length<=k) return s;
        StringBuilder stringBuilder=new StringBuilder();
        for(int i=0;i<k;i++){
            stringBuilder.append(s1[i]);
            if(i<k-1) stringBuilder.append(" ");
        }
        return stringBuilder.toString();
    }
}
```

方法二：

```java
class Solution {
    public String truncateSentence(String s, int k) {
        String res="";
        int count=0;
        for (char c : s.toCharArray()) {
            if(c!=' '){
                res+=c;
            }else{
                count++;
                if(count==k) break;
                else res+=' ';
            }
        }
        return res;
    }
}
```

方法三：

```java
class Solution {
    public String truncateSentence(String s, int k) {
        for(int i=0;i<s.length();i++){
            if(s.charAt(i)==' ' && --k==0) return s.substring(0,i);
        }
        return s;
    }
}
```

## [14. 最长公共前缀](https://leetcode-cn.com/problems/longest-common-prefix/)

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String res="";
        int index=0;
        while(true){
            char subStr=' ';
            for (String str : strs) {
                if(index<str.length()){
                    if(subStr==' ') subStr=str.charAt(index);
                    else if(subStr!=str.charAt(index)) return res;
                }else{
                    return res;
                }
            }
            res+=subStr;
            index++;
        }
    }
}
```

换一种方式：

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        String res="";
        char[][] strChars=new char[strs.length][];
        int minLen=Integer.MAX_VALUE;
        for (int i=0;i<strs.length;i++) {
            strChars[i]=strs[i].toCharArray();
            if(minLen>strChars[i].length) minLen=strChars[i].length;
        }
        int index=0;
        while(index<minLen){
            char c=' ';
            for (char[] strChar : strChars) {
                if(c==' ') c=strChar[index];
                else if(c!=strChar[index]) return res;
            }
            res+=c;
            index++;
        }
        return res;
    }
}
```

优化版：

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if(strs.length==0) return "";
        String str=strs[0];
        int index=0;
        while(index<str.length()){
            for(int i=1;i<strs.length;i++){
                if(index<strs[i].length()){
                    if(str.charAt(index)!=strs[i].charAt(index)) 
                        return str.substring(0,index);
                }else{
                    return str.substring(0,index);
                }
            }
            index++;
        }
        return str.substring(0,index);
    }
}
```

代码优化版：

```java
class Solution {
    public String longestCommonPrefix(String[] strs) {
        if(strs.length==0) return "";
        String str=strs[0];
        int index=0;
        while(index<str.length()){
            for(int i=1;i<strs.length;i++){
                if(index>=strs[i].length() || str.charAt(index)!=strs[i].charAt(index))
                    return str.substring(0,index);
            }
            index++;
        }
        return str.substring(0,index);
    }
}
```



## [1869. 哪种连续子字符串更长](https://leetcode-cn.com/problems/longer-contiguous-segments-of-ones-than-zeros/)

```java
class Solution {
    public boolean checkZeroOnes(String s) {
        int maxLen0=0;
        int maxLen1=0;
        int len=0;
        boolean zero=false;

        for(char c:s.toCharArray()){
            if(c=='0'){
                if(zero){
                    if(++len>maxLen0) maxLen0=len;
                }else{
                    len=1;
                    if(len>maxLen0) maxLen0=len;
                    zero=true;
                }
            }else{
                if(zero){
                    len=1;
                    if(1>maxLen1) maxLen1=1;
                    zero=false;
                }else{
                    if(++len>maxLen1) maxLen1=len;
                }
            }
        }
        return maxLen1>maxLen0;
    }
}
```

## [551. 学生出勤记录 I](https://leetcode-cn.com/problems/student-attendance-record-i/)

```java
class Solution {
    public boolean checkRecord(String s) {
        int absentNum=0;
        int lateNum=0;
        for(char c:s.toCharArray()){
            if(c=='A'){
                lateNum=0;
                if(++absentNum>1){
                    return false;
                }
            }else if(c=='L'){
                if(++lateNum>=3){
                    return false;
                }
            }else{
                lateNum=0;
            }
        }
        return true;
    }
}
```

## [1221. 分割平衡字符串](https://leetcode-cn.com/problems/split-a-string-in-balanced-strings/)

```java
class Solution {
    public int balancedStringSplit(String s) {
        int num=0;
        int left=0,right=0;
        for(int i=0;i<s.length();i++){
            if(s.charAt(i)=='L'){
                left++;
            }
            if(s.charAt(i)=='R'){
                right++;     
            }
            if(left==right){
                num++;
                left=0;
                right=0;
            }
        }
        return num;
    }
}
```

## [647. 回文子串](https://leetcode-cn.com/problems/palindromic-substrings/)

方法一：暴力

```java
class Solution {
    public int countSubstrings(String s) {
        int num=0;
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            num+=countSubstringsHelper(chars,i);
        }
        return num;
    }

    public int countSubstringsHelper(char[] charArray,int from){
        int num=0;
        int i=from;
        while(i<charArray.length){
            int start=from,end=i;
            boolean flag=true;
            while(start<end){
                if(charArray[start]!=charArray[end]){
                    flag=false;
                    break;
                }
                ++start;
                --end;
            }
            if(flag) ++num;
            i++;
        }
        return num;
    }
}
```

方法二：中心扩展法

```java
class Solution {
    public int countSubstrings(String s) {
        int count=0;
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            int n=1;
            int left=i-1,right=i+1;
            while(left>=0 && right<chars.length){
                if(chars[left]==chars[right]){
                    ++n;
                    --left;
                    ++right;
                }else{
                    break;
                }
            }
            count+=n;
        }

        for(int i=0;i<chars.length-1;i++){
            int n=0;
            if(chars[i]==chars[i+1]){
                ++n;
                int left=i-1,right=i+2;
                while(left>=0 && right<chars.length){
                    if(chars[left]==chars[right]){
                        ++n;
                        --left;
                        ++right;
                    }else{
                        break;
                    }
                }
            }
            count+=n;
        }
        return count;
    }
}
```

优化版：

```java
class Solution {
    public int countSubstrings(String s) {
        int count=0;
        char[] chars = s.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            int n=1;
            int left=i-1,right=i+1;
            while(left>=0 && right<chars.length){
                if(chars[left]==chars[right]){
                    ++n;
                    --left;
                    ++right;
                }else{
                    break;
                }
            }
            
            if(i<chars.length-1 && chars[i]==chars[i+1]){
                ++n;
                left=i-1;
                right=i+2;
                while(left>=0 && right<chars.length){
                    if(chars[left]==chars[right]){
                        ++n;
                        --left;
                        ++right;
                    }else{
                        break;
                    }
                }
            }
            count+=n;
        }
        return count;
    }
}
```

## [482. 密钥格式化](https://leetcode-cn.com/problems/license-key-formatting/)

方法一

```java
class Solution {
    public String licenseKeyFormatting(String s, int k) {
        s=s.toUpperCase().replaceAll("-","");
        StringBuilder sb=new StringBuilder(s);
        for(int i=sb.length()-k;i>0;i-=k){
            sb.insert(i,'-');
        }
        return sb.toString();
    }
}
```

方法二：

```java
class Solution {
    public String licenseKeyFormatting(String s, int k) {
        StringBuilder sb=new StringBuilder();
        for(int i=s.length()-1,len=0;i>=0;--i){
            if(s.charAt(i)=='-') continue;
            sb.append(s.charAt(i));
            if(++len%k==0){
                sb.append('-');
            }
        }
        if(sb.length()>0 && sb.charAt(sb.length()-1)=='-') sb.deleteCharAt(sb.length()-1);
        return sb.reverse().toString().toUpperCase();
    }
}
```

## [5. 最长回文子串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

方法：扩展中心法

```java
class Solution {
    public String longestPalindrome(String s) {
        if(s.length()==0) return "";
        int start=0,end=1;
        for(int i=0;i<s.length();i++){
            int left=i-1,right=i+1;
            if(left>=0 && right<s.length()) {
                while(s.charAt(left) == s.charAt(right)){
                    if((right-left+1)>(end-start)){
                        start=left;
                        end=right+1;
                    }
                    if(--left<0) break;
                    if(++right>=s.length()) break;
                }
            }

            if(i+1<s.length() && s.charAt(i)==s.charAt(i+1)){
                if((end-start)<2){
                    start=i;
                    end=i+2;
                }
                left=i-1;
                right=i+2;
                if(left<0 || right>=s.length()) continue;
                while(s.charAt(left) == s.charAt(right)){
                    if((right-left+1)>(end-start)){
                        start=left;
                        end=right+1;
                    }
                    if(--left<0) break;
                    if(++right>=s.length()) break;
                }
            }
        }

        return s.substring(start,end);
    }
}
```

## [738. 单调递增的数字](https://leetcode-cn.com/problems/monotone-increasing-digits/)

方法：从右往左遍历，当当前的数字比前一个数字大时，将前一个数字减一，当前的数字变为9

```java
class Solution {
    public int monotoneIncreasingDigits(int n) {
        char[] chars = Integer.toString(n).toCharArray();
        int i=chars.length-1;
        while(i>0){
            if(chars[i]<chars[i-1]){
                --chars[i-1];
                int j=i;
                while(j< chars.length){
                    chars[j++]='9';
                }
            }
            --i;
        }
        return Integer.parseInt(new String(chars));
    }
}
```









# 回溯法

## [77. 组合](https://leetcode-cn.com/problems/combinations/)

```java
class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> res=new ArrayList<>();
        combineHelper(res,n,k,new ArrayList<>());
        return res;
    }

    public void combineHelper(List<List<Integer>> res,int n,int k,List<Integer> array){
        if(array.size()==k){
            res.add(array);
            return ;
        }
        int i=1;
        if(!array.isEmpty()){
            i=array.get(array.size()-1)+1;
        }
        while(i<=n){
            List<Integer> newArray=new ArrayList<>(array);
            newArray.add(i);
            combineHelper(res,n,k,newArray);
            i++;
        }
    }
}
```







## [39. 组合总和](https://leetcode-cn.com/problems/combination-sum/)

思路：

![image-20210424105127592](D:\blog\source\_drafts\leetcode刷题\1.png)

去重：

![image-20210424105436797](D:\blog\source\_drafts\leetcode刷题\2.png)

```java
class Solution {
    private List<List<Integer>> res;
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        res=new ArrayList<>();
        combinationSumHelper(candidates,0,new ArrayList<>(),target);
        return res;
    }

    public void combinationSumHelper(int[] candidates,int index,List<Integer> path,int target){
        if(target==0) {
            res.add(path);
            return ;
        }

        for(int i=index;i<candidates.length;i++){
            int remain=target-candidates[i];
            if(remain>=0) {
                List<Integer> newPath=new ArrayList<>();   //每次递归都创建一个新的ArrayList
                newPath.addAll(path);
                newPath.add(candidates[i]);
                combinationSumHelper(candidates,i,newPath,remain);
            }
        }
    }
}
```

优化版：

```java
class Solution {
    private List<List<Integer>> res;
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        res=new ArrayList<>();
        combinationSumHelper(candidates,0,new ArrayList<>(),target);
        return res;
    }

    public void combinationSumHelper(int[] candidates,int index,List<Integer> path,int target){
        if(target==0) {
            res.add(new ArrayList<>(path));   //是有效路径时才创建一个新的ArrayList
            return ;
        }

        for(int i=index;i<candidates.length;i++){
            int remain=target-candidates[i];
            if(remain>=0) {
                path.add(candidates[i]);       //添加节点到path
                combinationSumHelper(candidates,i,path,remain);
                path.remove(path.size()-1);    //回溯时对path重置状态
            }
        }
    }
}
```

## [40. 组合总和 II](https://leetcode-cn.com/problems/combination-sum-ii/)

<img src="D:\blog\source\_drafts\leetcode刷题\3.png" alt="image-20210424120615232" style="zoom:80%;" />

```java
class Solution {
    private List<List<Integer>> res;
    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        res=new ArrayList<>();
        Arrays.sort(candidates);   //先排序
        combinationSumHelper2(candidates,0,new ArrayList<>(),target);
        return res;
    }
    
    public void combinationSumHelper2(int[] candidates,int index,List<Integer> path,int target){
        if(target==0) {
            res.add(new ArrayList<>(path));
            return ;
        }
        for(int i=index;i<candidates.length;i++){
            int remain=target-candidates[i];
            if(remain>=0){
                if(i>index && candidates[i]==candidates[i-1]) continue;   //去重
                path.add(candidates[i]);
                combinationSumHelper2(candidates,i+1,path,remain);   //因为不能重复，所以i+1
                path.remove(path.size()-1);
            }else{
                break;   
            }
        }
    }
}
```

## [216. 组合总和 III](https://leetcode-cn.com/problems/combination-sum-iii/)

```java
class Solution {
    public List<List<Integer>> combinationSum3(int k, int n) {
        List<List<Integer>> res=new ArrayList<>();
        combinationSum3Helper(res,new ArrayList<>(),1,k,n);
        return res;
    }

    public void combinationSum3Helper(List<List<Integer>> res,List<Integer> array,int num,int k,int remain){
        if(k==0){
            if(remain==0) {
                res.add(array);
            }
            return ;
        }
        if(remain<=0) return;

        for(int i=num;i<10;i++){
            List<Integer> newArray=new ArrayList<>(array);
            newArray.add(i);
            combinationSum3Helper(res,newArray,i+1,k-1,remain-i);
        }
    }
}
```





## [377. 组合总和 Ⅳ](https://leetcode-cn.com/problems/combination-sum-iv/)

方法一：在[39. 组合总和](https://leetcode-cn.com/problems/combination-sum/)的基础上修改（超时）

```java
class Solution {
    private int pathNum;
    public int combinationSum4(int[] nums, int target) {
        pathNum=0;
        combinationSumHelper4(nums, target);
        return pathNum;
    }

    public void combinationSumHelper4(int[] nums,int target){
        if(target==0){
            pathNum++;
            return ;
        }

        for (int i = 0; i < nums.length; i++) {
            int remain=target-nums[i];
            if(remain>=0){
                combinationSumHelper4(nums,remain);
            }
        }
    }
}
```



## [1688. 比赛中的配对次数](https://leetcode-cn.com/problems/count-of-matches-in-tournament/)

```java
class Solution {
    public int numberOfMatches(int n) {
        if(n==1) return 0;

        int matchNum=0;
        if(n%2==0) {
            matchNum=n/2;
            n=matchNum;
        }else{
            matchNum=(n-1)/2;
            n=matchNum+1;
        }
        
        return matchNum+numberOfMatches(n);    
    }
}
```

代码优化版：

```java
class Solution {
    public int numberOfMatches(int n) {
        if(n==1) return 0;
        return n%2==0? n/2+numberOfMatches(n/2):(n-1)/2+numberOfMatches((n-1)/2+1);
    }
}
```



## [78. 子集](https://leetcode-cn.com/problems/subsets/)

方法一：遍历枚举法

```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();

        for (int num : nums) {
            List<Integer> list=new ArrayList<>();
            list.add(num);
            int len=res.size();
            for(int i=0;i<len;i++){
                List<Integer> numList=new ArrayList<>(res.get(i));
                numList.add(num);
                res.add(numList);
            }
            res.add(list);
        }
        res.add(new ArrayList<>());
        return res;
    }
}
```

方法二：递归法枚举

```java
class Solution {
    private List<List<Integer>> subsetres;
    
    public List<List<Integer>> subsets(int[] nums){
        subsetres=new ArrayList<>();
        subsetRecursion(0,nums);
        subsetres.add(new ArrayList<>());
        return subsetres;
    }

    public void subsetRecursion(int i, int[] nums){
        if(i>=nums.length) return ;
        int size=subsetres.size();
        for(int j=0;j<size;j++){
            List<Integer> subset=new ArrayList<>(subsetres.get(j));
            subset.add(nums[i]);
            subsetres.add(subset);
        }
        
        List<Integer> numList=new ArrayList<>();
        numList.add(nums[i]);
        subsetres.add(numList);

        subsetRecursion(++i,nums);
    }
}
```

代码优化：

```java
class Solution {
    public List<List<Integer>> subsets(int[] nums){
        List<List<Integer>> res=new ArrayList<>();
        subsetRecursion(res,0,nums);
        res.add(new ArrayList<>());
        return res;
    }

    public void subsetRecursion(List<List<Integer>> res,int i, int[] nums){
        if(i>=nums.length) return ;

        int size=res.size();
        for(int j=0;j<size;j++){
            List<Integer> subset=new ArrayList<>(res.get(j));
            subset.add(nums[i]);
            res.add(subset);
        }

        List<Integer> numList=new ArrayList<>();
        numList.add(nums[i]);
        res.add(numList);

        subsetRecursion(res,++i,nums);
    }
}
```

方法三：回溯法

![image-20210508172544877](D:\blog\source\_drafts\leetcode刷题\4.png)

```java
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        subsetBackTrack(res,new ArrayList<>(),nums,0);
        res.add(new ArrayList<>());
        return res;
    }

    public void subsetBackTrack(List<List<Integer>> res,List<Integer> subset,int[] nums,int start){
        if(subset.size()==nums.length) return ;

        for(int i=start;i<nums.length;i++){
            List<Integer> newSubset=new ArrayList<>(subset);
            newSubset.add(nums[i]);
            res.add(newSubset);
            subsetBackTrack(res,newSubset,nums,i+1);
        }
    }
}
```



## [90. 子集 II](https://leetcode-cn.com/problems/subsets-ii/)

回溯法：横向筛选

```java
class Solution {
    public List<List<Integer>> subsetsWithDup(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        Arrays.sort(nums);
        backTrack(res,new ArrayList<>(),nums,0);
        res.add(new ArrayList<>());
        return res;
    }

    public void backTrack(List<List<Integer>> res,List<Integer> subset,int[] nums,int start){
        if(subset.size()==nums.length) return ;

        for(int i=start;i<nums.length;){
            List<Integer> newSubset=new ArrayList<>(subset);
            newSubset.add(nums[i]);
            res.add(newSubset);

            backTrack(res,newSubset,nums,i+1);

            while(++i<nums.length && nums[i]==nums[i-1]) {}   //通过这来横向筛选
            
        }
    }
}
```

## [22. 括号生成](https://leetcode-cn.com/problems/generate-parentheses/)

方法：回溯法

<img src="D:\blog\source\_drafts\leetcode刷题\5.png" alt="image-20210515165246422" style="zoom: 67%;" />

```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> list=new ArrayList<>();
        parenthesisHelper(list,"(",1,0,n);
        return list;
    }

    public void parenthesisHelper(List<String> list,String parenthesis,int start,int back,int n){
        if(start==n && back==n) {
            list.add(parenthesis);
            return ;
        }

        if(start<n) parenthesisHelper(list,parenthesis+"(",start+1, back,n);
        if(start>back) parenthesisHelper(list,parenthesis+")",start,back+1, n);
    }
}
```

时间内存优化版：

```java
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> list=new ArrayList<>();
        parenthesisHelper(list,"(",n-1,n);
        return list;
    }

    public void parenthesisHelper(List<String> list,String parenthesis,int start,int back){
        if(start==0 && back==0) {
            list.add(parenthesis);
            return ;
        }

        if(start>0) parenthesisHelper(list,parenthesis+"(",start-1, back);
        if(start<back) parenthesisHelper(list,parenthesis+")",start,back-1);
    }
}
```

## [389. 找不同](https://leetcode-cn.com/problems/find-the-difference/)

方法一：

```java
class Solution {
    public char findTheDifference(String s, String t) {
        char[] sChars = s.toCharArray();
        char[] tChars = t.toCharArray();
        Arrays.sort(sChars);
        Arrays.sort(tChars);
        for (int i = 0; i < sChars.length; i++) {
            if(sChars[i]!=tChars[i]){
                return tChars[i];
            }
        }
        return tChars[s.length()];
    }
}
```

方法二：求和

```java
class Solution {
    public char findTheDifference(String s, String t) {
        int sNum=0,tNum=0;
        for (char c : s.toCharArray()) {
            sNum+=c;
        }
        for (char c : t.toCharArray()) {
            tNum+=c;
        }
        return (char) (tNum-sNum);
    }
}
```

## [17. 电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)

方法：哈希集+回溯

![image-20210830203441570](D:\blog\source\_drafts\leetcode刷题\10.png)

```java
class Solution {
    public List<String> letterCombinations(String digits) {
        List<String> res=new ArrayList<>();
        Map<Character,String> dataMap=new HashMap<>();
        dataMap.put('2',"abc");
        dataMap.put('3',"def");
        dataMap.put('4',"ghi");
        dataMap.put('5',"jkl");
        dataMap.put('6',"mno");
        dataMap.put('7',"pqrs");
        dataMap.put('8',"tuv");
        dataMap.put('9',"wxyz");
        
        letterCombinationsHelper(res,dataMap,digits,0,new StringBuffer());
        return res;
    }

    public void letterCombinationsHelper(List<String> res,Map<Character,String> dataMap,String digits,int index,StringBuffer stringBuffer){
        if(digits.length()==index){
            if(stringBuffer.length()>0){
                res.add(stringBuffer.toString());
            }
            return;
        }
        String keyData = dataMap.get(digits.charAt(index));
        for (char c : keyData.toCharArray()) {
            letterCombinationsHelper(res,dataMap,digits,index+1,stringBuffer.append(c));
            stringBuffer.deleteCharAt(stringBuffer.length()-1);
        }
    
    }
}
```

## [46. 全排列](https://leetcode-cn.com/problems/permutations/)

```java
class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<Integer> numList=new ArrayList<>();
        for (int num : nums) {
            numList.add(num);
        }
        List<List<Integer>> res=new ArrayList<>();
        premuteHelper(numList,res,new ArrayList<>());
        return res;
    }

    public void premuteHelper(List<Integer> numList,List<List<Integer>> res,List<Integer> array){
        if(numList.isEmpty()){
            res.add(array);
            return ;
        }

        int size=numList.size();
        for(int i=0;i<size;i++){
            Integer node=numList.get(i);
            List<Integer> newArray=new ArrayList<>(array);
            newArray.add(node);
            numList.remove(node);
            premuteHelper(numList,res,newArray);
            numList.add(i,node);
        }

    }
}
```

## [47. 全排列 II](https://leetcode-cn.com/problems/permutations-ii/)

```java
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        // numList[0]: nums    numList[1]: 使用情况,0-未使用;  1-已使用
        int[][] numList=new int[2][nums.length];
        Arrays.sort(nums);
        numList[0]=nums;
        permuteUniqueHelper(res,numList,new ArrayList<>());
        return res;
    }

    public void permuteUniqueHelper(List<List<Integer>> res,int[][] numList,List<Integer> array){
        if(array.size()==numList[0].length){
            res.add(array);
            return ;
        }
        for(int i=0;i<numList[0].length;i++){
            if(numList[1][i]==1){
                continue;
            }
            if(i+1<numList[0].length && numList[0][i]==numList[0][i+1] && numList[1][i]!=numList[1][i+1]){
                continue;
            }

            List<Integer> newArray=new ArrayList<>(array);
            newArray.add(numList[0][i]);
            numList[1][i]=1;
            permuteUniqueHelper(res,numList,newArray);
            numList[1][i]=0;
        }
    }

}
```

优化：

```java
class Solution {
    public List<List<Integer>> permuteUnique(int[] nums) {
        List<List<Integer>> res=new ArrayList<>();
        boolean[] useInfo=new boolean[nums.length];
        Arrays.sort(nums);
        permuteUniqueHelper(res,nums,useInfo,new ArrayList<>());
        return res;
    }

    public void permuteUniqueHelper(List<List<Integer>> res,int[] nums,boolean[] useInfo,List<Integer> array){
        if(array.size()==nums.length){
            res.add(array);
            return ;
        }
        for(int i=0;i<nums.length;i++){
            if(useInfo[i] || i>0 && nums[i]==nums[i-1] && !useInfo[i-1]){
                continue;
            }
          

            List<Integer> newArray=new ArrayList<>(array);
            newArray.add(nums[i]);
            useInfo[i]=true;
            permuteUniqueHelper(res,nums,useInfo,newArray);
            useInfo[i]=false;
        }
    }
}
```

## [93. 复原 IP 地址](https://leetcode-cn.com/problems/restore-ip-addresses/)

```java
class Solution {
    public List<String> restoreIpAddresses(String s) {
        List<String> res=new ArrayList<>();
        restoreIpAddressesHelper(res,s.toCharArray(),0,0,new StringBuilder());
        return res;
    }

    public void restoreIpAddressesHelper(List<String> res,char[] ipArray,int index,int deep,StringBuilder ipBuilder){
        if(deep==4){

            if(index==ipArray.length){
                ipBuilder.deleteCharAt(ipBuilder.length()-1);
                res.add(ipBuilder.toString());
            }
            return;
        }

        if(index>=ipArray.length) return ;

        if(ipArray[index]=='0'){
            restoreIpAddressesHelper(res,ipArray,index+1,deep+1,new StringBuilder(ipBuilder).append("0."));
        }else{
            List<String> ipNums=new ArrayList<>();
            int i=1;
            while(index+i<=ipArray.length && i<=3){
                char[] numChars = Arrays.copyOfRange(ipArray, index, index + i);
                int num=0;
                for(char n:numChars){
                    num=num*10+(n-'0');
                }
                if(num<=255){
                    ipNums.add(num+"");
                }
                i++;
            }
            for (String ipNum : ipNums) {
                restoreIpAddressesHelper(res,ipArray,index+ipNum.length(),deep+1,new StringBuilder(ipBuilder).append(ipNum+"."));
            }
        }
    
    }
}
```

## [131. 分割回文串](https://leetcode-cn.com/problems/palindrome-partitioning/)

方法：画图

![image-20210925201004969](D:\blog\source\_drafts\leetcode刷题\11.png)

```java
class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> res=new ArrayList<>();
        partitionHelper(res,new ArrayList<String>(),s.toCharArray(),0);
        return res;
    }

    public void partitionHelper(List<List<String>> res,List<String> partition,char[] charArray,int from){
        if(from == charArray.length){
            res.add(partition);
            return;
        }
        List<String> palindromes = findPalindrome(charArray, from);
        for (String palindrome : palindromes) {
            List<String> newPartition=new ArrayList<>(partition);
            newPartition.add(palindrome);
            partitionHelper(res,newPartition,charArray,from+palindrome.length());
        }
    }

    public List<String> findPalindrome(char[] charArray,int from){
        List<String> palindromes=new ArrayList<>();
        int i=from;
        while(i < charArray.length){
            boolean flag=true;
            int start=from,end=i;
            while(start<end){
                if(charArray[start]!=charArray[end]){
                    flag=false;
                    break;
                }
                ++start;
                --end;
            }
            if(flag){
                palindromes.add(new String(charArray,from,i-from+1));
            }
            ++i;
        }
        return palindromes;
    }
}
```

优化版：

```java
class Solution {

    private List<List<String>> res;
    public List<List<String>> partition(String s) {
        res=new ArrayList<>();
        partitionHelper(new ArrayList<String>(),s.toCharArray(),0);
        return res;
    }

    public void partitionHelper(List<String> partition,char[] charArray,int from){
        if(from == charArray.length){
            res.add(new ArrayList<>(partition));
            return;
        }
        List<String> palindromes = findPalindrome(charArray, from);
        for (String palindrome : palindromes) {
            partition.add(palindrome);
            partitionHelper(partition,charArray,from+palindrome.length());
            partition.remove(partition.size()-1);
        }
    }

    public List<String> findPalindrome(char[] charArray,int from){
        List<String> palindromes=new ArrayList<>();
        int i=from;
        while(i < charArray.length){
            boolean flag=true;
            int start=from,end=i;
            while(start<end){
                if(charArray[start]!=charArray[end]){
                    flag=false;
                    break;
                }
                ++start;
                --end;
            }
            if(flag){
                palindromes.add(new String(charArray,from,i-from+1));
            }
            ++i;
        }
        return palindromes;
    }
}
```









# 数组

## [1470. 重新排列数组](https://leetcode-cn.com/problems/shuffle-the-array/)

最直接的方法：

```java
class Solution {
    public int[] shuffle(int[] nums, int n) {
        int[] res=new int[2*n];
        int j=0;
        for(int i=0;i<n;i++,j++){
            res[j++]=nums[i];
            res[j]=nums[i+n];
        }
        return res;
    }
}
```

## [1480. 一维数组的动态和](https://leetcode-cn.com/problems/running-sum-of-1d-array/)

方法一：空间复杂度O(n)

```java
class Solution {
    public int[] runningSum(int[] nums) {
        int[] res=new int[nums.length];
        res[0]=nums[0];
        for(int i=1;i<nums.length;i++){
            res[i]=nums[i]+res[i-1];
        }
        return res;
    }
}
```

优化空间复杂度：

```java
class Solution {
    public int[] runningSum(int[] nums) {
        for(int i=1;i<nums.length;i++){
            nums[i]+=nums[i-1];
        }
        return nums;
    }
}
```

## [1672. 最富有客户的资产总量](https://leetcode-cn.com/problems/richest-customer-wealth/)

```java
class Solution {
    public int maximumWealth(int[][] accounts) {
        int maxWealth=0;
        for(int i=0;i<accounts.length;i++){
            int wealth=0;
            for(int j=0;j<accounts[i].length;j++){
                wealth+=accounts[i][j];
            }
            if(wealth>maxWealth) maxWealth=wealth;
        }
        return maxWealth;
    }
}
```

## [1431. 拥有最多糖果的孩子](https://leetcode-cn.com/problems/kids-with-the-greatest-number-of-candies/)

```java
class Solution {
    public List<Boolean> kidsWithCandies(int[] candies, int extraCandies) {
        int max=0;
        for(int candy:candies){
            if(candy>max) max=candy;
        }
        List<Boolean> list=new ArrayList<>();
        for(int candy:candies){
            list.add(candy+extraCandies>=max);
        }
        return list;
    }
}
```

##  [1365. 有多少小于当前数字的数字](https://leetcode-cn.com/problems/how-many-numbers-are-smaller-than-the-current-number/)

方法一：暴力法

```java
class Solution {
    public int[] smallerNumbersThanCurrent(int[] nums) {
        int[] res=new int[nums.length];
        for(int i=0;i<nums.length;i++){
            int n=0;
            for(int j=0;j<nums.length;j++){
                if(j!=i && nums[i]>nums[j]){
                    n++;
                }
            }
            res[i]=n;
        }
        return res;
    }
}
```

## [1854. 人口最多的年份](https://leetcode-cn.com/problems/maximum-population-year/)

暴力法：

```java
class Solution {
    public int maximumPopulation(int[][] logs) {
        quickSort(logs,0,logs.length-1);

        int curPopu=0,curYear;
        int maxPopu=0,maxYear=0;
        List<Integer> deathList=new ArrayList<>();

        for(int i=0;i<logs.length;i++){
            curYear=logs[i][0];
            curPopu++;
            deathList.add(logs[i][1]);
            Collections.sort(deathList);
            int j=0;
            while(j<deathList.size() && deathList.get(j)<=curYear){
                curPopu--;
                deathList.remove(0);
                j++;
            }
            if(curPopu>maxPopu) {
                maxPopu=curPopu;
                maxYear=curYear;
            }
        }
        return maxYear;
    }
	
    //对出生年份进行快排
    public void quickSort(int[][] logs,int left,int right){
        if(left>=right) return;

        int[] k=logs[left];
        int i=left,j=right;
        while(i<j){
            while(i<j && logs[j][0]>=k[0]) --j;
            if(i<j) logs[i++]=logs[j];

            while (i<j && logs[i][0]<=k[0]) ++i;
            if(i<j) logs[j--]=logs[i];
        }
        logs[i]=k;

        quickSort(logs,left,i-1);
        quickSort(logs,i+1,right);
    }
}
```

方法二：差分法

```java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int count=0;    //人数
        int maxCount=0;    //最大人数
        int offset=1950;      //起始年
        int res=0;    //记录最大人数年份与1950的差值
        int[] dp=new int[101];    //每一年的人数变化
        //统计每一年人数的变化
        for (int[] log : logs) {
            ++dp[log[0]-offset];
            --dp[log[1]-offset];
        }
        //获取最多人数的年份
        for (int i = 0; i < dp.length; i++) {
            count+=dp[i];
            if(count>maxCount) {
                maxCount=count;
                res=i;
            }
        }
        return offset+res;
    }
}
```

代码优化：

```java
class Solution {
    public int maximumPopulation(int[][] logs) {
        int count=0,maxCount=0,offset=1950,res=0;
        int[] dp=new int[101];

        for (int[] log : logs) {
            ++dp[log[0]-offset];
            --dp[log[1]-offset];
        }

        for (int i = 0; i < dp.length; i++) {
            if((count+=dp[i])>maxCount){
                maxCount=count;
                res=i;
            }
        }
        return offset+res;
    }
}
```

## [1109. 航班预订统计](https://leetcode-cn.com/problems/corporate-flight-bookings/)

方法一：模拟法/暴力法

```java
class Solution {
    public int[] corpFlightBookings(int[][] bookings, int n) {
        int[] answer=new int[n];
        for (int[] booking : bookings) {
            int first=booking[0]-1;
            int last=booking[1];
            while(first<last){
                answer[first++]+=booking[2];
            }
        }
        return answer;
    }
}
```

方法二：差分法

把问题看成上下车问题：

```
比如在示例一中, bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5
    10人在0时上车，2时下车
    20人在1时上车，3时下车
    25人在1时上车，5时下车
    那么，
    我们用一个数组ans记录车辆人数变化
    ans[i]表示在i时刻人数变化
    比如ans[i]的值为+x，即在i时刻车辆增加x人
        ans[i]的值为-x，即在i时刻车辆减少x人

    这个问题求的是在每个时刻车内人数
    只用简单的求个前缀和就行了
```

```java
class Solution {
    public int[] corpFlightBookings(int[][] bookings, int n) {
        int[] count = new int[n];
        for (int[] booking : bookings) {
            count[booking[0] - 1] += booking[2];
            if (booking[1] < n) count[booking[1]] -= booking[2];
        }
        for (int i = 1; i < n; i++) {
            count[i] += count[i - 1];
        }
        return count;
    }
}
```

## [1094. 拼车](https://leetcode-cn.com/problems/car-pooling/)

方法：差分法

```java
class Solution {
    public boolean carPooling(int[][] trips, int capacity) {
        int roadLen=1001;
        //记录路上客人数量的变化
        int[] count=new int[roadLen];
        for (int[] trip : trips) {
            count[trip[1]]+=trip[0];
            count[trip[2]]-=trip[0];
        }
        if(count[0]>capacity) return false;
        for (int i = 1; i < roadLen; i++) {
            if((count[i]+=count[i-1])>capacity) return false;
        }
        return true;
    }
}
```



## [169. 多数元素](https://leetcode-cn.com/problems/majority-element/)

方法：选举法

```java
class Solution {
    public int majorityElement(int[] nums) {
        int count=0;
        Integer candidate=null;
        for(int i:nums){
            if(count==0) candidate=i;
            if(candidate==i) ++count;
            else --count;
        }
        return candidate;
    }
}
```



## [485. 最大连续 1 的个数](https://leetcode-cn.com/problems/max-consecutive-ones/)

```java
class Solution {
    public int findMaxConsecutiveOnes(int[] nums) {
        int max=0;
        int consecutiveNum=0;
        
        for(int num:nums){
            if(num==1){
                consecutiveNum++;
            }else{
                if(consecutiveNum>max) max=consecutiveNum;
                consecutiveNum=0;
            }
        }
        return Math.max(max, consecutiveNum);
    }
}
```



## [1893. 检查是否区域内所有整数都被覆盖](https://leetcode-cn.com/problems/check-if-all-the-integers-in-a-range-are-covered/)

方法：捉住提示：

- 1 <= ranges.length <= 50
- 1 <= starti <= endi <= 50
- 1 <= left <= right <= 50

```java
class Solution {
    public boolean isCovered(int[][] ranges, int left, int right) {
        byte[] finalRanges=new byte[51];
        for (int[] range : ranges) {
            Arrays.fill(finalRanges,range[0],range[1]+1, (byte) 1);
        }
        while(left<=right){
            if(finalRanges[left++]!=1) return false;
        }
        return true;
    }
}
```

## [1588. 所有奇数长度子数组的和](https://leetcode-cn.com/problems/sum-of-all-odd-length-subarrays/)

方法一：暴力

```java
class Solution {
    public int sumOddLengthSubarrays(int[] arr) {
        int res=0;
        for(int i=0;i<arr.length;i++){
            int num=arr[i];
            for(int j=i+1;j<arr.length;j++){
                if((j-i)%2==0){
                    for(int r=i;r<=j;r++){
                        num+=arr[r];
                    }
                }
            }
            res+=num;
        }
        return res;
    }
}
```

## [165. 比较版本号](https://leetcode-cn.com/problems/compare-version-numbers/)

```java
class Solution {
    public int compareVersion(String version1, String version2) {
        String[] versionList1 = version1.split("\\.");
        String[] versionList2 = version2.split("\\.");
        for(int i=0,j=0;i<versionList1.length || j<versionList2.length;){
            int v1=0,v2=0;
            if(i<versionList1.length){
                v1=Integer.parseInt(versionList1[i++]);
            }
            if(j< versionList2.length){
                v2=Integer.parseInt(versionList2[j++]);
            }
            if(v1>v2) return 1;
            if(v1<v2) return -1;
        }
        return 0;
    }
}
```

优化空间复杂度：

```java
class Solution {
    public int compareVersion(String version1, String version2) {
        for(int i=0,j=0;i<version1.length() || j<version2.length();++i,++j){
            int v1=0,v2=0;
            while(i<version1.length() && version1.charAt(i)!='.'){
                v1=v1*10+(version1.charAt(i++)-'0');
            }
            while(j<version2.length() && version2.charAt(j)!='.'){
                v2=v2*10+(version2.charAt(j++)-'0');
            }
            if(v1>v2) return 1;
            if(v1<v2) return -1;
        }
        return 0;
    }
}
```

## [面试题 17.14. 最小K个数](https://leetcode-cn.com/problems/smallest-k-lcci/)

方法一：暴力法

```java
class Solution {
    public int[] smallestK(int[] arr, int k) {
        int[] res=new int[k];
        if(k==0) return res;
        
        System.arraycopy(arr, 0, res, 0, k);
        int maxIndex=findMaxIndex(res);
        for(;k<arr.length;k++){
            if(res[maxIndex]>arr[k]){
                res[maxIndex]=arr[k];
                maxIndex=findMaxIndex(res);
            }
        }
        return res;
    }

    public int findMaxIndex(int[] arr){
        int index=0;
        for(int i=1;i<arr.length;i++){
            if(arr[i]>arr[index]){
                index=i;
            }
        }
        return index;
    }
}
```

方法二：用堆

```java
class Solution {
    public int[] smallestK(int[] arr, int k) {
        int[] res=new int[k];
        if(k==0) return res;

        PriorityQueue<Integer> queue=new PriorityQueue<>(k,new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o2-o1;
            }
        });
        
        for(int i=0;i<k;i++){
            queue.offer(arr[i]);
        }
        
        for(;k<arr.length;k++){
            if(queue.peek()>arr[k]){
                queue.poll();
                queue.offer(arr[k]);
            }
        }
        
        for(int i=0;i<res.length;i++){
            res[i]=queue.poll();
        }
        
        return res;
    }
}
```

方法三：排序

```java
class Solution {
    public int[] smallestK(int[] arr, int k) {
        int[] res=new int[k];
        if(k==0) return res;
        Arrays.sort(arr);
        System.arraycopy(arr,0,res,0,k);
        return res;
    }
}
```

## [495. 提莫攻击](https://leetcode-cn.com/problems/teemo-attacking/)

```java
class Solution {
    public int findPoisonedDuration(int[] timeSeries, int duration) {
        if(timeSeries.length==0) return 0;

        int res=duration;
        int time=timeSeries[0]+duration;
        for(int i=1;i<timeSeries.length;i++){
            if(time<=timeSeries[i]){
                res+=duration;                
            }else{
                res=res-(time-timeSeries[i])+duration;         
            }
            time=timeSeries[i]+duration;
        }
        return res;
    }
}
```

## [162. 寻找峰值](https://leetcode-cn.com/problems/find-peak-element/)

```java
class Solution {
    public int findPeakElement(int[] nums) {
        if(nums.length<2) return 0;

        int i=0;
        while(i+1<nums.length){
            while(i+1<nums.length && nums[i]<nums[i+1]){
                i++;
            }
            if(i+1<nums.length && nums[i]>nums[i+1]) return i;
            i++;
        }
        return i-1;
    }
}
```

## [36. 有效的数独](https://leetcode-cn.com/problems/valid-sudoku/)

```java
class Solution {
    public boolean isValidSudoku(char[][] board) {
        int[][] map=new int[2][9];
        int[][][] boxMap=new int[3][3][9];
        // 行&列
        for(int i=0;i<9;i++){
            for(int j=0;j<9;j++){
                // 行
                if(board[i][j]!='.'){
                    if(map[0][board[i][j]-'0'-1]>0) return false;
                    map[0][board[i][j]-'0'-1]=1;
                    
                    if(boxMap[i/3][j/3][board[i][j]-'0'-1]>0) return false;
                    boxMap[i/3][j/3][board[i][j]-'0'-1]=1;
                }
                //列
                if(board[j][i]!='.'){
                    if(map[1][board[j][i]-'0'-1]>0) return false;
                    map[1][board[j][i]-'0'-1]=1;
                }

            }
            Arrays.fill(map[0],0);
            Arrays.fill(map[1],0);
        }
        
        return true;
    }
}
```

## [1031. 两个非重叠子数组的最大和](https://leetcode-cn.com/problems/maximum-sum-of-two-non-overlapping-subarrays/)

```java
class Solution {
    public int maxSumTwoNoOverlap(int[] nums, int firstLen, int secondLen) {
        // 前缀和
        int[] preSum=new int[nums.length+1];
        for (int i = 0; i < nums.length; i++) {
            preSum[i+1]=nums[i]+preSum[i];
        }

        // 使firstLen<secondLen
        if(firstLen>secondLen){
            int temp=firstLen;
            firstLen=secondLen;
            secondLen=temp;
        }

        // 假设firstLen<secondLen
        // dp[0][0]:在分界线i中，前firstLen前缀和最大值
        // dp[0][1]:在分界线i中，后secondLen前缀和最大值
        // dp[1][0]:在分界线i中，前secondLen前缀和最大值
        // dp[1][1]:在分界线i中，后firstLen前缀和最大值
        int[][] dp=new int[2][2];

        int res=0;

        for(int i=firstLen;i<preSum.length;i++){

            if(i+secondLen<preSum.length){
                int firstSum=preSum[i]-preSum[i-firstLen];
                if(firstSum>dp[0][0]){
                    dp[0][0]=firstSum;
                    dp[0][1]=0;
                    for(int j=i;j+secondLen<preSum.length;j++){
                        int secondSum=preSum[j+secondLen]-preSum[j];

                        if(secondSum>dp[0][1]){
                            dp[0][1]=secondSum;
                        }
                    }

                    if(dp[0][0]+dp[0][1]>res){
                        res=dp[0][0]+dp[0][1];
                    }
                }
            }

            if(i>=secondLen && i+firstLen< preSum.length){
                int secondSum=preSum[i]-preSum[i-secondLen];
                if(secondSum>dp[1][0]){
                    dp[1][0]=secondSum;
                    dp[1][1]=0;
                    for(int j=i;j+firstLen<preSum.length;j++){
                        int firstSum=preSum[j+firstLen]-preSum[j];
                        if(firstSum>dp[1][1]){
                            dp[1][1]=firstSum;
                        }
                    }

                    if(dp[1][0]+dp[1][1]>res){
                        res=dp[1][0]+dp[1][1];
                    }
                }
            }

        }
        return res;
    }
}
```

## [31. 下一个排列](https://leetcode-cn.com/problems/next-permutation/)

方法：https://leetcode-cn.com/problems/next-permutation/solution/xia-yi-ge-pai-lie-suan-fa-xiang-jie-si-lu-tui-dao-/

```java
class Solution {
    public void nextPermutation(int[] nums) {
        int i=nums.length-2,j=nums.length-1;
        int k=j;
        while(i>=0 && nums[i]>=nums[j]){
            i--;
            j--;
        }
        if(j==0){
            reverse(nums,0,nums.length-1);
        }else{
            while(nums[i]>=nums[k]){
                k--;
            }
            swap(nums,i,k);
            reverse(nums,j,nums.length-1);
        }
    }

    // 交换
    public void swap(int[] nums,int i,int j){
        int temp=nums[i];
        nums[i]=nums[j];
        nums[j]=temp;
    }

    // 反转数组
    public void reverse(int[] nums,int from,int to){
        while(from<to){
            swap(nums,from++,to--);
        }
    }
}
```






# 链表

## [237. 删除链表中的节点](https://leetcode-cn.com/problems/delete-node-in-a-linked-list/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public void deleteNode(ListNode node) {
        node.val=node.next.val;
        node.next=node.next.next;
    }
}
```

## [21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        if(l1==null) return l2;
        if(l2==null) return l1;

        ListNode res;
        ListNode head;

        if(l1.val<=l2.val){
            res=new ListNode(l1.val,null);
            head=res;
            l1=l1.next;
        }else{
            res=new ListNode(l2.val,null);
            head=res;
            l2=l2.next;
        }

        while(l1!=null && l2!=null){
            ListNode node;
            if(l1.val<=l2.val){
                node=new ListNode(l1.val,null);
                l1=l1.next;
       
            } else{
                node=new ListNode(l2.val,null);
                l2=l2.next;
       
            }
            res.next=node;
            res=res.next;
        }
        if(l1!=null) res.next=l1;
        if(l2!=null) res.next=l2;

        return head;
    }
}
```

优化版：

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        if(l1==null) return l2;
        if(l2==null) return l1;

        ListNode res;
        ListNode head;

        if(l1.val<=l2.val){
            res=l1;
            head=res;
            l1=l1.next;
        }else{
            res=l2;
            head=res;
            l2=l2.next;
        }

        while(l1!=null && l2!=null){
            if(l1.val<=l2.val){
                res.next=l1;
                l1=l1.next;
            } else{
                res.next=l2;
                l2=l2.next;
            }
            res=res.next;
        }
        if(l1!=null) res.next=l1;
        if(l2!=null) res.next=l2;

        return head;
    }
}
```

再优化版：

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        
        ListNode res=new ListNode(-1);
        ListNode head=res;

        while(l1!=null && l2!=null){
            if(l1.val<=l2.val){
                res.next=l1;
                l1=l1.next;
            } else{
                res.next=l2;
                l2=l2.next;
            }
            res=res.next;
        }
        if(l1!=null) res.next=l1;
        if(l2!=null) res.next=l2;

        return head.next;
    }
}
```

## [203. 移除链表元素](https://leetcode-cn.com/problems/remove-linked-list-elements/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        while(head!=null && head.val==val) head=head.next;
        if(head==null) return null;

        ListNode preCur=head;
        ListNode cur=head.next;
        while(cur!=null){
            if(cur.val!=val) {
                preCur=cur;
                cur=cur.next;
            } else {
                while(cur!=null && cur.val==val) cur=cur.next;
                preCur.next=cur;
                preCur=cur;
                if(cur!=null) cur=cur.next;
            }
        }
        return head;

    }
}
```

优化版：

```java
class Solution {
    public ListNode removeElements(ListNode head, int val) {
        ListNode dummyHead=new ListNode(0,head);
        ListNode temp=dummyHead;
        
        while(temp.next!=null){
            if(temp.next.val==val) temp.next=temp.next.next;
            else temp=temp.next;
        }

        return dummyHead.next;
    }
}
```

## [剑指 Offer 52. 两个链表的第一个公共节点](https://leetcode-cn.com/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/)

方法一：Hash表

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        Set<ListNode> set=new HashSet<>();
        ListNode node=headA;
        while(node!=null){
            set.add(node);
            node=node.next;
        }
        node=headB;
        while(node!=null){
            if(set.contains(node)){
                return node;
            }
            node=node.next;
        }
        return null;
    }
}
```

方法二：

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode node1=headA;
        ListNode node2=headB;

        while(node1!=node2){
            node1=node1==null? headB:node1.next;
            node2=node2==null? headA:node2.next;
        }

        return node1;
    }
}
```



## [83. 删除排序链表中的重复元素](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode p=head;
        
        while(p!=null){
            ListNode i=p.next;
            while(i!=null && i.val==p.val) i=i.next;
            p.next=i;
            p=p.next;
        }

        return head;
    }
}
```

## [82. 删除排序链表中的重复元素 II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode res=new ListNode();
        ListNode p=res;
        while(head!=null){
            if(head.next!=null){
                if(head.val!=head.next.val){
                    p.next=new ListNode(head.val);
                    p=p.next;
                }else{
                    while(head.next!=null && head.val==head.next.val){
                        head=head.next;
                    }
                }
            }else{
                p.next=new ListNode(head.val);
            }
            head=head.next;
        }

        return res.next;
    }
}
```

优化版：

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode res=new ListNode();
        ListNode p=res;
        while(head!=null){
            if(head.next!=null){
                if(head.val!=head.next.val){
                    p.next=head;
                    p=p.next;
                }else{
                    while(head.next!=null && head.val==head.next.val){
                        head=head.next;
                    }
                }
            }else{
                p.next=head;
                p=p.next;
            }
            head=head.next;
        }
        p.next=null;
        return res.next;
    }
}
```

代码优化：

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode res=new ListNode();
        ListNode p=res;
        while(head!=null){
            if(head.next!=null && head.val==head.next.val){
                while(head.next!=null && head.val==head.next.val){
                    head=head.next;
                }
            }else{
                p.next=head;
                p=p.next;
            }
                
            head=head.next;
        }
        p.next=null;
        return res.next;
    }
}
```





## [206. 反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode pre=null;   //前一个指针
        ListNode cur=head;   //当前指针
        
        while(cur!=null){
            ListNode nextTemp=cur.next;
            cur.next=pre;
            pre=cur;
            cur=nextTemp;
        }
        return pre;
    }
}
```



## [1290. 二进制链表转整数](https://leetcode-cn.com/problems/convert-binary-number-in-a-linked-list-to-integer/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public int getDecimalValue(ListNode head) {
        int res=head.val;
        while(head.next!=null){
            head=head.next;
            res=res*2+head.val;
        }
        return res;
    }
}
```

## [86. 分隔链表](https://leetcode-cn.com/problems/partition-list/)

方法一：时间O(n)，空间O(n)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode leftHead=new ListNode();
        ListNode left=leftHead;

        ListNode rightHead=new ListNode();
        ListNode right=rightHead;
        
        ListNode cur=head;
        while(cur!=null){
            if(cur.val<x){
                left.next=new ListNode(cur.val);
                left=left.next;
            }else{
                right.next=new ListNode(cur.val);
                right=right.next;
            }
            cur=cur.next;
        }
        left.next=rightHead.next;
        return leftHead.next;
    }
}
```

优化：空间O(1)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode partition(ListNode head, int x) {
        ListNode leftHead=new ListNode();
        ListNode left=leftHead;

        ListNode rightHead=new ListNode();
        ListNode right=rightHead;
        
        while(head!=null){
            if(head.val<x){
                left.next=head;
                left=left.next;

                head=head.next;
                left.next=null;
            }else{
                right.next=head;
                right=right.next;
                
                head=head.next;
                right.next=null;
            }
            
        }
        left.next=rightHead.next;
        return leftHead.next;
    }
}
```

## [24. 两两交换链表中的节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode res=new ListNode();
        ListNode p=res;
        //以两两为单位
        while(head!=null && head.next!=null){
            p.next=head.next;
            p=p.next;
            ListNode nextTemp=p.next;
            p.next=head;
            p=p.next;
            p.next=null;
            head=nextTemp;
        }
        if(head!=null) p.next=head;
        return res.next;
    }
}
```



## [114. 二叉树展开为链表](https://leetcode-cn.com/problems/flatten-binary-tree-to-linked-list/)

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

    public void flatten(TreeNode root) {
        List<TreeNode> preOrderlist=new ArrayList<>();
        preOrder(root, preOrderlist);
        for(int i=0;i<preOrderlist.size()-1;i++){
            TreeNode cur=preOrderlist.get(i);
            TreeNode next=preOrderlist.get(i+1);
            cur.left=null;
            cur.right=next;
        }

    }

    public void preOrder(TreeNode node,List<TreeNode> preOrderlist){
        if(node==null) return ;
        preOrderlist.add(node);
        preOrder(node.left,preOrderlist);
        preOrder(node.right,preOrderlist);
    }
}
```

方法二：将前序遍历倒过来，通过`右-左-头`可以将前序遍历倒过来

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

    private TreeNode pre=null;

    public void flatten(TreeNode root) {
        if(root==null) return ;
        flatten(root.right);
        flatten(root.left);
        root.left=null;
        root.right=pre;
        pre=root;    
    }
}
```

## [138. 复制带随机指针的链表](https://leetcode-cn.com/problems/copy-list-with-random-pointer/)

<img src="D:\blog\source\_drafts\JVM学习之Java内存区域与内存溢出异常\6.png" alt="image-20210809163755152" style="zoom:80%;" />

```java
/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/

class Solution {
    public Node copyRandomList(Node head) {
        if(head==null) return null;
        Node p=head;
        //将原链表1->2->3  复制结点成：1->1->2->2->3->3
        while(p!=null){
            Node copyNode=new Node(p.val);
            copyNode.next=p.next;
            p.next=copyNode;
            p=p.next.next;
        }

        //设置随机指针
        p=head;
        while(p!=null){
            Node copyNode=p.next;
            if(p.random==null){
                copyNode.random=null;
            }else{
                copyNode.random=p.random.next;
            }
            p=p.next.next;
        }

        //分离链表
        p=head;
        Node res=p.next;
        while(p!=null){
            Node copyNode=p.next;
            p.next=copyNode.next;
            if(p.next==null){
                copyNode.next=null;
            }else{
                copyNode.next=p.next.next;
            }            
            p=p.next;
        }

        return res;
    }
}
```

## [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

方法一：求链表的长度

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        int len=getLength(head);
        ListNode res=new ListNode(0,head);
        ListNode p=res;
        for(int i=0;i<len-n;i++){
            p=p.next;
        }
        p.next=p.next.next;
        return res.next;
        
    }

    public int getLength(ListNode head){
        int len=0;
        while(head!=null){
            len++;
            head=head.next;
        }
        return len;
    }
}
```

## [148. 排序链表](https://leetcode-cn.com/problems/sort-list/)

方法一：笨方法

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode sortList(ListNode head) {
        List<Integer> list=new ArrayList<>();
        ListNode p=head;
        while(p!=null){
            list.add(p.val);
            p=p.next;
        }
        Collections.sort(list);
        ListNode res=new ListNode();
        p=res;
        for (Integer i : list) {
            p.next=new ListNode(i);
            p=p.next;
        }
        return res.next;
    }
}
```

方法二：插入排序法，时间O(n^2)，空间O(1)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode sortList(ListNode head) {
        ListNode res=new ListNode();

        while(head!=null){
            ListNode nextTemp=head.next;
            ListNode pre=res;
            ListNode cur=res.next;
            while(cur!=null && cur.val<head.val){
                pre=pre.next;
                cur=cur.next;
            }
            pre.next=head;
            head.next=cur;
            head=nextTemp;
        }

        return res.next;
    }
}
```

方法三：归并排序

![Picture2.png](D:\blog\source\_drafts\JVM学习之Java内存区域与内存溢出异常\9.png)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode sortList(ListNode head) {
        //分割链表，并对链表进行排序
        ListNode middle=head,end=head;
        while(end!=null && end.next!=null){
            middle=middle.next;
            end=end.next.next;
        }
        
        //只有一个结点
        if(middle==head){
            return head;
        }

        //只有两个结点
        if(middle.next==null){
            if(head.val<head.next.val){
                return head;
            }else{
                ListNode res=head.next;
                head.next=null;
                res.next=head;
                return res;
            }
        }

        ListNode nextTemp=middle.next;
        middle.next=null;
        
        ListNode left=sortList(head);
        ListNode right=sortList(nextTemp);
        return merge(left,right);
    }

    //合并两个递增的单链表
    public ListNode merge(ListNode A,ListNode B){
        ListNode res=new ListNode();
        ListNode p=res;
        while(A!=null && B!=null){
            if(A.val<B.val){
                p.next=A;
                A=A.next;
            }else{
                p.next=B;
                B=B.next;
            }
            p=p.next;
        }
        if(A!=null){
            p.next=A;
        }
        if(B!=null){
            p.next=B;
        }
        return res.next;
    }
}
```

## [876. 链表的中间结点](https://leetcode-cn.com/problems/middle-of-the-linked-list/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode middleNode(ListNode head) {
        if(head==null) return null;
        ListNode middle=head,end=head.next;
        while(end!=null && end.next!=null){
            middle=middle.next;
            end=end.next.next;
        }
		return end==null? middle:middle.next;
    }
}
```

## [141. 环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

方法一：用Set

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> set=new HashSet<>();
        while(head!=null){
            if(set.contains(head)) return true;
            set.add(head);
            head=head.next;
        }
        return false;
    }
}
```

方法二：快慢指针

Floyd 判圈算法，也叫：龟兔赛跑算法

假想「乌龟」和「兔子」在链表上移动，「兔子」跑得快，「乌龟」跑得慢。当「乌龟」和「兔子」从链表上的同一个节点开始移动时，如果该链表中没有环，那么「兔子」将一直处于「乌龟」的前方；如果该链表中有环，那么「兔子」会先于「乌龟」进入环，并且一直在环内移动。等到「乌龟」进入环时，由于「兔子」的速度快，它一定会在某个时刻与乌龟相遇，即套了「乌龟」若干圈。

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public boolean hasCycle(ListNode head) {
        if(head==null) return false;
        ListNode slow=head,fast=head.next;
        while(fast!=null && fast.next!=null){
            if(slow==fast) return true;
            slow=slow.next;
            fast=fast.next.next;
        }
        return false;
    }
}
```

## [142. 环形链表 II](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

方法一：HashSet

```java
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode detectCycle(ListNode head) {
        Set<ListNode> set=new HashSet<>();
        while(head!=null){
            if(set.contains(head)) return head;
            set.add(head);
            head=head.next;
        }
        return null;
    }
}
```

方法二：



## [147. 对链表进行插入排序](https://leetcode-cn.com/problems/insertion-sort-list/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode insertionSortList(ListNode head) {
        ListNode res=new ListNode();
        
        while(head!=null){
            ListNode nextHead=head.next;
            
            ListNode p=res;
            while(p.next!=null && p.next.val<head.val){
                p=p.next;
            }
            ListNode nextTemp=p.next;
            p.next=head;
            p.next.next=nextTemp;
            head=nextHead;
        }

        return res.next;
    }
}
```

## [1721. 交换链表中的节点](https://leetcode-cn.com/problems/swapping-nodes-in-a-linked-list/)

分别找出前后两个目标结点

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapNodes(ListNode head, int k) {
        ListNode preTarget=head;
        ListNode backTarget=head,backHelper=head;
        for(int i=1;i<k;i++){
            preTarget=preTarget.next;
        }
        for(int i=1;i<k;i++){
            backHelper=backHelper.next;
        }
        while(backHelper.next!=null){
            backHelper=backHelper.next;
            backTarget=backTarget.next;
        }
        int temp=preTarget.val;
        preTarget.val=backTarget.val;
        backTarget.val=temp;
        
        return head;
    }
}
```

优化版：

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapNodes(ListNode head, int k) {
        ListNode preTarget=head;
        ListNode backTarget=head,backHelper;
        for(int i=1;i<k;i++){
            preTarget=preTarget.next;
        }

        backHelper=preTarget;
        while(backHelper.next!=null){
            backHelper=backHelper.next;
            backTarget=backTarget.next;
        }

        int temp=preTarget.val;
        preTarget.val=backTarget.val;
        backTarget.val=temp;

        return head;
    }
}
```

## [328. 奇偶链表](https://leetcode-cn.com/problems/odd-even-linked-list/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode oddEvenList(ListNode head) {
        //奇数链表
        ListNode oddList=new ListNode();
        ListNode p1=oddList;
        //偶数链表
        ListNode evenList=new ListNode();
        ListNode p2=evenList;
        int i=1;
        while(head!=null){
            ListNode nextTemp=head.next;
            if(i++%2==0){
                p2.next=head;
                p2=p2.next;
                p2.next=null;
            }else{
                p1.next=head;
                p1=p1.next;
                p1.next=null;
            }
            head=nextTemp;
        }
        p1.next=evenList.next;
        return oddList.next;
    }
}
```

## [1669. 合并两个链表](https://leetcode-cn.com/problems/merge-in-between-linked-lists/)

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
        ListNode p1=list1,p2=list1;
        ListNode p3=list2;
        while(p3!=null && p3.next!=null){
            p3=p3.next;
        }

        while(--a>0){
            p1=p1.next;
            p2=p2.next;
            b--;
        }

        while(b>=0){
            p2=p2.next;
            b--;
        }

        p1.next=list2;
        p3.next=p2;

        return list1;
    }
}
```





# 队列

## [641. 设计循环双端队列](https://leetcode-cn.com/problems/design-circular-deque/)

```java
class MyCircularDeque {

    int[] circularDeuqe;
    int head,tail,size;

    /** Initialize your data structure here. Set the size of the deque to be k. */
    public MyCircularDeque(int k) {
        circularDeuqe=new int[k];
        head=0;
        tail=0;
        size=0;
    }
    
    /** Adds an item at the front of Deque. Return true if the operation is successful. */
    public boolean insertFront(int value) {
        if(isFull()) return false;
        head=Math.floorMod(head,circularDeuqe.length);
        circularDeuqe[head++]=value;
        size++;
        return true;
    }
    
    /** Adds an item at the rear of Deque. Return true if the operation is successful. */
    public boolean insertLast(int value) {
        if(isFull()) return false;
        tail=Math.floorMod(tail-1,circularDeuqe.length);
        circularDeuqe[tail]=value;
        size++;
        return true;
    }
    
    /** Deletes an item from the front of Deque. Return true if the operation is successful. */
    public boolean deleteFront() {
        if(isEmpty()) return false;
        head=Math.floorMod(--head,circularDeuqe.length);
        size--;
        return true;
    }
    
    /** Deletes an item from the rear of Deque. Return true if the operation is successful. */
    public boolean deleteLast() {
        if(isEmpty()) return false;
        tail=Math.floorMod(++tail,circularDeuqe.length);
        size--;
        return true;
    }
    
    /** Get the front item from the deque. */
    public int getFront() {
        if(isEmpty()) return -1;
        return circularDeuqe[Math.floorMod(head-1,circularDeuqe.length)];
    }
    
    /** Get the last item from the deque. */
    public int getRear() {
        if(isEmpty()) return -1;
        return circularDeuqe[Math.floorMod(tail,circularDeuqe.length)];
    }
    
    /** Checks whether the circular deque is empty or not. */
    public boolean isEmpty() {
        return size==0;
    }
    
    /** Checks whether the circular deque is full or not. */
    public boolean isFull() {
       return size==circularDeuqe.length;
    }
}

/**
 * Your MyCircularDeque object will be instantiated and called as such:
 * MyCircularDeque obj = new MyCircularDeque(k);
 * boolean param_1 = obj.insertFront(value);
 * boolean param_2 = obj.insertLast(value);
 * boolean param_3 = obj.deleteFront();
 * boolean param_4 = obj.deleteLast();
 * int param_5 = obj.getFront();
 * int param_6 = obj.getRear();
 * boolean param_7 = obj.isEmpty();
 * boolean param_8 = obj.isFull();
 */
```



# 位运算

## [401. 二进制手表](https://leetcode-cn.com/problems/binary-watch/)

```java
class Solution {
    public List<String> readBinaryWatch(int turnedOn) {
        List<String> ans=new ArrayList<>();
        for(int hour=0;hour<12;hour++){
            for(int min=0;min<60;min++){
                //Integer.bitCount(int value)      显示value的二进制数有多少个1
                if(Integer.bitCount(hour)+Integer.bitCount(min)==turnedOn){
                    ans.add(hour+":"+(min<10? "0"+min:min));
                }
            }
        }
        return ans;
    }
}
```

## [剑指 Offer 15. 二进制中1的个数](https://leetcode-cn.com/problems/er-jin-zhi-zhong-1de-ge-shu-lcof/)

方法一：利用Java的函数

```java
public class Solution {
    // you need to treat n as an unsigned value
    public int hammingWeight(int n) {
        return Integer.bitCount(n);
    }
}
```

# 滑动窗口

## [3. 无重复字符的最长子串](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        if(s.length()==0) return 0;
        StringBuilder stringBuilder=new StringBuilder();
        char[] chars = s.toCharArray();
        stringBuilder.append(chars[0]);
        int maxSize=1;
        for (int i = 1; i < chars.length; i++) {
            int index = stringBuilder.indexOf(chars[i] + "");
            if(index>=0){
                stringBuilder.delete(0,index+1);
            }
            stringBuilder.append(chars[i]+"");
            if(stringBuilder.length()>maxSize) maxSize=stringBuilder.length();
        }
        return maxSize;
    }
}
```

优化版：

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> set=new HashSet<>();
        int size=0;
        char[] chars = s.toCharArray();
        for (int i=0; i<chars.length; i++) {
            if(set.contains(chars[i])){
                int j=i-set.size();
                while(chars[j]!=chars[i]){
                    set.remove(chars[j++]);
                }
                set.remove(j);
            }
            set.add(chars[i]);
            if(set.size()>size) size=set.size();
        }
        return size;
    }
}
```

## [1423. 可获得的最大点数](https://leetcode-cn.com/problems/maximum-points-you-can-obtain-from-cards/)

方法一：超时

```java
class Solution {
    public int maxScore(int[] cardPoints, int k) {
        int max=0;
        for (int i = cardPoints.length-k; i <= cardPoints.length; i++) {
            int score=0;
            for (int j = 0; j < k; j++) {
                score+=cardPoints[(i+j)%cardPoints.length];
            }
            if(score>max) max=score;
        }
        return max;
    }
}
```

时间优化版：

```java
class Solution {
    public int maxScore(int[] cardPoints, int k) {
        int max;
        int score=0;
        int i;
        for (i = cardPoints.length-k; i < cardPoints.length; i++) {
            score+=cardPoints[i];
        }
        max=score;
        int left=cardPoints.length-k;
        int right=0;
        for(i=cardPoints.length-k;i<cardPoints.length;i++){
            score-=cardPoints[left++];
            score+=cardPoints[right++];
            if(score>max) max=score;
        }
        return max;
    }
}
```

代码优化：

```java
class Solution {
    public int maxScore(int[] cardPoints, int k) {
        int max;
        int score=0;
        for (int i = cardPoints.length-k; i < cardPoints.length; i++) {
            score+=cardPoints[i];
        }
        max=score;
        for(int left=cardPoints.length-k,right=0;left<cardPoints.length;left++,right++){
            score-=cardPoints[left];
            score+=cardPoints[right];
            if(score>max) max=score;
        }
        return max;
    }
}
```

## [643. 子数组最大平均数 I](https://leetcode-cn.com/problems/maximum-average-subarray-i/)

```java
class Solution {
    public double findMaxAverage(int[] nums, int k) {
        int max;
        int sum=0;
        for(int i=0; i<k; i++){
            sum+=nums[i];
        }    
        max=sum;
        for(int i=0;i+k<nums.length;i++){
            sum-=nums[i];
            sum+=nums[i+k];
            if(sum>max) max=sum;
        }
        return 1.0*max/k;
    }
}
```

## [187. 重复的DNA序列](https://leetcode-cn.com/problems/repeated-dna-sequences/)

```java
class Solution {
    public List<String> findRepeatedDnaSequences(String s) {
        List<String> resList=new ArrayList<>();
        Map<String,Integer> map=new HashMap<>();
        for(int i=0,j=10;j<=s.length();i++,j++){
            String subStr=s.substring(i,j);
            if(map.get(subStr)==null){
                map.put(subStr,1);
            }else {
                if(map.get(subStr)==1) resList.add(subStr);
                map.put(subStr,map.get(subStr)+1);
            }
        }
        return resList;
    }
}
```

优化版：

```java
class Solution {
    public List<String> findRepeatedDnaSequences(String s) {
        Set<String> set=new HashSet<>();
        Set<String> outSet=new HashSet<>();
        for(int i=0;i+10<=s.length();i++){
            String subStr=s.substring(i,i+10);
            if(set.contains(subStr)){
                outSet.add(subStr);
            }else{
                set.add(subStr);
            }
        }
        return new ArrayList<>(outSet);
    }
}
```

## [1004. 最大连续1的个数 III](https://leetcode-cn.com/problems/max-consecutive-ones-iii/)

方法：滑动窗口

```java
class Solution {
    public int longestOnes(int[] nums, int k) {
        int max=0;
        int left=0,right=0;
        //记录滑动窗口中0的位置
        Queue<Integer> zeroNum=new LinkedList<>();
        while(right<nums.length){
            if(nums[right]==1){
                right++;
            }else {
                if(zeroNum.size()<k){
                    zeroNum.add(right);
                    right++;
                }else{
                    if((right-left)>max) max=right-left;
                    if(!zeroNum.isEmpty()){
                        left=zeroNum.poll()+1;
                    }else {
                        left=right+1;
                        right++;
                    }
                }
            }
        }
        return Math.max(max,right-left);
    }
}
```





# 前缀和

## [930. 和相同的二元子数组](https://leetcode-cn.com/problems/binary-subarrays-with-sum/)

方法一：前缀和，时间复杂度：O(n*n)

```java
class Solution {
    public int numSubarraysWithSum(int[] nums, int goal) {
        if(goal>nums.length) return 0;

        int num=0;
        int[] preSum=new int[nums.length+1];
        preSum[0]=0;
        for (int i = 0; i < nums.length; i++) {
            preSum[i+1]=preSum[i]+nums[i];
        }

        for(int i=1;i<preSum.length;i++){
            for(int j=0;j<i;j++){
                if(preSum[i]-preSum[j]==goal) num++;
                else if(preSum[i]-preSum[j]<goal) break;
            }
        }
        return num;
    }
}
```

方法二：前缀和+哈希，时间复杂度：O(n)，空间复杂度：O(n)

HashMap，Key存储：前缀和的值，Value存储：等于该值的前缀和数量

```java
class Solution {
    public int numSubarraysWithSum(int[] nums, int goal) {
        if(goal>nums.length) return 0;

        int num=0;     
        int preSum=0;    //前缀和
        Map<Integer,Integer> preSumMap=new HashMap<>();
        preSumMap.put(0,1);

        for (int i : nums) {
            preSum+=i;
            num+=preSumMap.getOrDefault(preSum-goal,0);
            preSumMap.put(preSum,preSumMap.getOrDefault(preSum,0)+1);

        }
        return num;
    }
}
```



## [724. 寻找数组的中心下标](https://leetcode-cn.com/problems/find-pivot-index/)

方法：前缀和

```java
class Solution {
    public int pivotIndex(int[] nums) {
        for (int i = 1; i < nums.length; i++) {
            nums[i]+=nums[i-1];
        }
        int index=0;
        for(;index<nums.length;index++){
            if(index==0){
                if(0==nums[nums.length-1]-nums[index]) break;
            }else{
                if(nums[index-1]==nums[nums.length-1]-nums[index]) break;
            }
        }
        return index==nums.length? -1:index;
    }
}
```



## [560. 和为K的子数组](https://leetcode-cn.com/problems/subarray-sum-equals-k/)

方法一：前缀+暴力

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        for (int i = 1; i < nums.length; i++) {
            nums[i]+=nums[i-1];
        }

        int res=0;
        for (int i = 0; i < nums.length; i++) {
            if(nums[i]==k) ++res;
            for(int j=i+1;j<nums.length;j++){
                if(nums[j]-nums[i]==k) ++res;
            }
        }
        return res;
    }
}
```

方法二：前缀+HashMap

```java
class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer,Integer> map=new HashMap<>();
        map.put(0,1);

        int res=0;
        for (int i = 0; i < nums.length; i++) {
            if(i>0) nums[i]+=nums[i-1];
            res+=map.getOrDefault(nums[i]-k,0);
            map.put(nums[i],map.getOrDefault(nums[i],0)+1);
        }
        return res;
    }
}
```



## [974. 和可被 K 整除的子数组](https://leetcode-cn.com/problems/subarray-sums-divisible-by-k/)

方法一：前缀+暴力(超时)

```java
class Solution {
    public int subarraysDivByK(int[] nums, int k) {
        int[] preSum=new int[nums.length+1];
        preSum[0]=0;
        for (int i = 0; i < nums.length; i++) {
            preSum[i+1]=preSum[i]+nums[i];
        }
        
        int res=0;
        for(int i=1;i<preSum.length;i++){
            for(int j=0;j<i;j++){
                if((preSum[i]-preSum[j])%k==0) res++; 
            }
        }
        return res;
    }
}
```

方法二：前缀+HashMap

倍数转变为求余

```java
class Solution {
    public int subarraysDivByK(int[] nums, int k) {
        Map<Integer,Integer> map=new HashMap<>();
        map.put(0,1);
        int preSum=0;
        int res=0;
        for (int i = 0; i < nums.length; i++) {
            preSum+=nums[i];
            int reminder=Math.floorMod(preSum,k);
            res+=map.getOrDefault(reminder,0);
            map.put(reminder,map.getOrDefault(reminder,0)+1);
        }
        return res;
    }
}
```

## [523. 连续的子数组和](https://leetcode-cn.com/problems/continuous-subarray-sum/)

方法一：用一个数组记录连续数组的和，超时

```java
class Solution {
    public boolean checkSubarraySum(int[] nums, int k) {
        int[] dp=new int[nums.length];
        for(int i=0;i<nums.length;i++){
            for(int j=0;j<=i;j++){
                dp[j]+=nums[i];
                if(i-j>0 && dp[j]%k==0) return true;    //数组长度>=2,i+1-j>=2
            }
        }
        return false;
    }
}
```

方法二：典型前缀和(超时)

```java
class Solution {
    public boolean checkSubarraySum(int[] nums, int k) {
        int[] preSum=new int[nums.length+1];
        preSum[0]=0;
        for (int i = 0; i < nums.length; i++) {
            preSum[i+1]=preSum[i]+nums[i];
        }

        for (int i = 1; i < preSum.length; i++) {
            for(int j=0;j<i;j++){
                if(i-j>1 && (preSum[i]-preSum[j])%k==0) return true;
            }
        }
        return false;
    }
}
```

方法三：前缀和+HashMap

倍数转变为求余

```java
class Solution {
    public boolean checkSubarraySum(int[] nums, int k) {
        // Key: 存放余数
        // Value: 存放位置,当位置重复时，取最小的
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 0);
        int preSum = 0;
        for (int i = 0; i < nums.length; i++) {
            preSum += nums[i];
            int reminder = Math.floorMod(preSum, k);
            if (map.containsKey(reminder)) {
                if ((i - map.get(reminder)) > 0) return true;
                continue;
            }
            map.put(reminder, i + 1);
        }
        return false;
    }
}
```

## [1248. 统计「优美子数组」](https://leetcode-cn.com/problems/count-number-of-nice-subarrays/)

方法一：前缀和+暴力（超时）

```java
class Solution {
    public int numberOfSubarrays(int[] nums, int k) {
        //奇数数量前缀和
        int[] oddNumQuatity=new int[nums.length+1];
        oddNumQuatity[0]=0;
        for (int i = 0; i < nums.length; i++) {
            oddNumQuatity[i+1]=nums[i]%2==0? oddNumQuatity[i]:oddNumQuatity[i]+1;
        }
        int res=0;
        for (int i = 1; i < oddNumQuatity.length; i++) {
            for(int j=0;j<i;j++){
                if((oddNumQuatity[i]-oddNumQuatity[j])==k) res++;
            }
        }
        return res;
    }
}
```

方法二：前缀和+HashMap

```java
public int numberOfSubarrays2(int[] nums, int k) {
    // Key: 奇数数量前缀和     Value: 前缀和数量
    Map<Integer,Integer> map=new HashMap<>();
    map.put(0,1);
    // 奇数数量前缀和
    int oddNumQuantity=0;
    int res=0;
    for (int num : nums) {
        oddNumQuantity = num % 2 != 0 ? ++oddNumQuantity : oddNumQuantity;
        res += map.getOrDefault(oddNumQuantity - k  , 0);
        map.put(oddNumQuantity, map.getOrDefault(oddNumQuantity, 0) + 1);
    }
    return res;
}
```











# 矩阵

## [48. 旋转图像](https://leetcode-cn.com/problems/rotate-image/)

<img src="D:\blog\source\_drafts\leetcode刷题\12.png" alt="image-20210928195459923" style="zoom:80%;" />

```java
class Solution {
    public void rotate(int[][] matrix) {
        int l=0,r=matrix.length-1;
        while(l<r){
            int[] temp=matrix[l];
            matrix[l]=matrix[r];
            matrix[r]=temp;
            ++l;
            --r;
        }

        for(l=0;l<matrix.length;++l){
            r=l+1;
            while(r<matrix.length){
                int temp=matrix[l][r];
                matrix[l][r]=matrix[r][l];
                matrix[r][l]=temp;
                ++r;
            }
        }
    }
}
```



# 分治法

## [105. 从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

方法：

![image-20211105205912202](D:\blog\source\_drafts\leetcode刷题\17.png)

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
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        Map<Integer,Integer> inorderMap=new HashMap<>();
        for(int i=0;i<inorder.length;i++){
            inorderMap.put(inorder[i],i);
        }
        return buildTreeHelper(preorder,0,preorder.length-1,inorder,0,inorder.length-1, inorderMap);
    }

    
    public TreeNode buildTreeHelper(int[] preorder,int preLeft,int preRight,
                                    int[] inorder,int inLeft,int inRight,
                                    Map<Integer,Integer> inorderMap){
        if(preLeft>preRight || inLeft>inRight){
            return null;
        }
        TreeNode node=new TreeNode(preorder[preLeft]);
        int pIndex=inorderMap.get(preorder[preLeft]);
        node.left=buildTreeHelper(preorder,preLeft+1,preLeft+pIndex-inLeft,
                                  inorder,inLeft,pIndex-1,inorderMap);
        node.right=buildTreeHelper(preorder,preLeft+pIndex-inLeft+1, preRight,
                                   inorder,pIndex+1, inRight,inorderMap);
        return node;
    }   
}
```

## [106. 从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

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
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        Map<Integer,Integer> map=new HashMap<>();
        for(int i=0;i<inorder.length;i++){
            map.put(inorder[i],i);
        }
        return buildTreeHelper(inorder,0,inorder.length-1,
                               postorder,0,postorder.length-1,map);
    }

    public TreeNode buildTreeHelper(int[] inorder,int inLeft,int inRight,
                                    int[] postOrder,int postLeft,int postRight,
                                    Map<Integer,Integer> map){
        if(inLeft>inRight || postLeft>postRight){
            return null;
        }
        TreeNode node=new TreeNode(postOrder[postRight]);
        int pIndex=map.get(postOrder[postRight]);
        node.left=buildTreeHelper(inorder,inLeft,pIndex-1,postOrder,
                                  postLeft,postRight-inRight+pIndex-1,map);
        node.right=buildTreeHelper(inorder,pIndex+1,inRight,postOrder,
                                   postRight-inRight+pIndex,postRight-1,map);
        return node;
    }
}
```

## [889. 根据前序和后序遍历构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

思路：每遍历一个点都要确定左子树边界和右子树边界

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
    public TreeNode constructFromPrePost(int[] preorder, int[] postorder) {
        Map<Integer,Integer> map=new HashMap<>();
        for(int i=0;i<postorder.length;i++){
            map.put(postorder[i],i);
        }
        return constructFromPrePost(preorder,0,preorder.length-1,
                postorder,0, postorder.length-1,map);
    }


    public TreeNode constructFromPrePost(int[] preorder,int preLeft,int preRight,
                                         int[] postorder,int postLeft,int postRight,
                                         Map<Integer,Integer> map) {
        if(preLeft>preRight || postLeft>postRight){
            return null;
        }

        TreeNode node=new TreeNode(preorder[preLeft]);
        
        if(preLeft+1<=preRight){
            int pIndex=map.get(preorder[preLeft+1]);
            node.left=constructFromPrePost(preorder,preLeft+1,preLeft+1+pIndex-postLeft,
                    postorder,postLeft,pIndex,map);
            node.right=constructFromPrePost(preorder,preLeft+pIndex-postLeft+2,preRight,
                    postorder,pIndex+1,postRight-1,map);
        }
        
        return node;
    }
}
```

## [215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

方法一：暴力

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length-k];
    }
}
```

方法二：基于快排的选择方法

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        int left=0,right=nums.length-1;
        int target=nums.length-k;
        while(left<=right){
            int index=particular(nums,left,right);
            if(index==target) return nums[target];
            else if(index<target){
                left=index+1;
            }else{
                right=index-1;
            }
        }
        return -1;
    }

    public int particular(int[] nums,int left,int right){
        int p=nums[left];
        while(left<right){
            while(left<right && nums[right]>p) --right;
            if(left<right) nums[left++]=nums[right];
            while(left<right && nums[left]<p) ++left;
            if(left<right) nums[right--]=nums[left];
        }
        nums[left]=p;
        return left;
    }
}
```

方法三：最大堆排序

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap=new PriorityQueue<>();
        for(int num:nums){
            heap.add(num);
            if(heap.size()>k){
                heap.poll();
            }
        }
        return heap.peek();
    }
}
```











# 堆

