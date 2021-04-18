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

递归法：

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
public int[] bubbleSort(int[] A){
    if(A==null) return new int[]{}; 
    for(int i=0;i<A.length-1;i++){
        for(int j=i+1;j<A.length;j++){
            if(A[i]>A[j]){    //从小到大排序
                int temp=A[i];
                A[i]=A[j];
                A[j]=temp;
            }
        }
    }
    return A;
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

# 数学

## [7. 整数反转](https://leetcode-cn.com/problems/reverse-integer/)

```java

```



