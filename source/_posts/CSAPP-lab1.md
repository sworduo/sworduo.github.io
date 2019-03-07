---
title: CSAPP-lab1-DATALAB
date: 2019-03-07 13:17:51
tags:
- c语言
- CSAPP
categories: c语言
copyright: true
---
{% asset_img head.jpg %}
本次实验主要是考察书本第二章的内容，要求掌握数字信息在计算机中的存储方式以及相关运算，比如数字的补码表示，补码运算；浮点数的表示和计算等，需要了解计算机是如何去“认识”一个数字。事实上题目本身不难，但是可用的运算操作符和最大的操作符数量有限制，这就使得题目难度陡升，需要仔细思考，纠结很久才能写完一题，这是因为本人对位运算不怎么熟悉。下面具体分析一下每一道题。  
(ps:[这里](https://skylark-workshop.xyz/blog/csapp-datalab-new/)有一个解释写的比较好的网站，位运算有时候就是想不出来，郁闷。)
<!--more-->



#	bitXor
这里要求使用~和&来实现异或。异或的关键是相同为0,不同为1,思路是发掘(0,0)和(1,1)，(1,0)和(0,1)两个组合各自共同点，以及两个组合之间的不同点。对于(0,0)和(1,1)，(x&~y)和(~x&y)的结果必定都等于0,而(0,1)和(1,0)的结果一个为0一个为1,当结果取反相与时，(0,0)和(1,1)的组合得到的结果是1,(0,1)和(1,0)组合得到的结果是0,这时候就能将两者区分开来了。

```C
/* 
 * bitXor - x^y using only ~ and & 
 *   Example: bitXor(4, 5) = 1
 *   Legal ops: ~ &
 *   Max ops: 14
 *   Rating: 1
 */
int bitXor(int x, int y) {
//for (0,0),(1,1),tmp1 and tmp2 are all 0, while one of (1,0) and (0,1) is 1.
//so for (0,0),(1,1) ~tmp1 and ~tmp2 are all 1, and one of (1,0) and (0,1) is 0 
  int tmp1 = (~x & y);
  int tmp2 = (x & ~y);
  int tmp3 = (~ tmp1) & (~ tmp2);
  int tmp4 = ~ tmp3;
  return tmp4;
}
```

#	tmin
这个是求补码的最小值，移位即可。

```C
/* 
 * tmin - return minimum two's complement integer 
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 4
 *   Rating: 1
 */
int tmin(void) {
//补码的最小值
  return 0x1<<31;
```

#	isTmax
以0111为例，观察到Tmax+1=1000,此时刚好每一位都与原来相反，所以异或结果为全1,取反结果为0,！后结果为1。除了max外，-1也有这样的效果，所以需要把-1的情况排除。
```C
/*
 * isTmax - returns 1 if x is the maximum, two's complement number,
 *     and 0 otherwise 
 *   Legal ops: ! ~ & ^ | +
 *   Max ops: 10
 *   Rating: 1
 */
int isTmax(int x) {
  int tmp = !(~x);//if x=-1 then tmp=1 else 0
  return !(~((x + 1) ^ x) | tmp);
}
```

#	allOddBits
判断是不是所有奇数位上的数值全是1。弄一个mask比较就行。这里有个技巧就是使用可以使用的最大整数（题目要求使用的整数为0～255）移位快速生成mask，而不是一位一位的移位穷举。

```C
/* 
 * allOddBits - return 1 if all odd-numbered bits in word set to 1
 *   where bits are numbered from 0 (least significant) to 31 (most significant)
 *   Examples allOddBits(0xFFFFFFFD) = 0, allOddBits(0xAAAAAAAA) = 1
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 12
 *   Rating: 2
 */
int allOddBits(int x) {
/*  int mask = (0xaa | (0xaa<<8) | (0xaa<<16) | (0xaa<<24));*/
//mask &&aaaaaaaa
  int mask = (0xaa << 8) + 0xaa;
  mask = (mask << 16) + mask;
  return !((x & mask) ^ mask);
}
```

#	negate
直接取反加一就好。

```C
/* 
 * negate - return -x 
 *   Example: negate(1) = -1.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 5
 *   Rating: 2
 */
int negate(int x) {
  return ~x + 1;
}
```

#	isAsciiDigit
判断x是否是0-9之间的Ascii码。  
1.	判断5-8位是不是0x3
2.	判断第四位是不是0,对应0-7的情况
3.	判断是不是8和9
```C
/* 
 * isAsciiDigit - return 1 if 0x30 <= x <= 0x39 (ASCII codes for characters '0' to '9')
 *   Example: isAsciiDigit(0x35) = 1.
 *            isAsciiDigit(0x3a) = 0.
 *            isAsciiDigit(0x05) = 0.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 15
 *   Rating: 3
 */
int isAsciiDigit(int x) {
  int high = !((x>>4) ^ 0x3);
  int tmp1 = !((x&0x8) ^ 0);
  int xtmp = x&0xf;
  int tmp2 = !(xtmp ^ 0x8);
  int tmp3 = !(xtmp ^ 0x9); 
  return high & (tmp1 | tmp2 | tmp3);
}
```

#	conditional
实现x?y:z。
1.	判断x是否成立，即x是否不为0
2.	若不为0,则生成全1的mask，若为0,则生成全0的mask
3.	得到结果

```C
/* 
 * conditional - same as x ? y : z 
 *   Example: conditional(2,4,5) = 4
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 16
 *   Rating: 3
 */
int conditional(int x, int y, int z) {
  int mask = !!x;
  mask = (mask<<1) + mask;
  mask = (mask<<2) + mask;
  mask = (mask<<4) + mask;
  mask = (mask<<8) + mask;
  mask = (mask<<16) + mask;
  return (mask&y) | ((~mask)&z);
}
```

#	isLessOrEqual
判断s是否小于y，有三种情况：
1.	x<0, y>0
2.	x,y同号且x-y<0
3.	x==y
第一、二种情况可以通过判断结果的最高位来判断。
```C
/* 
 * isLessOrEqual - if x <= y  then return 1, else return 0 
 *   Example: isLessOrEqual(4,5) = 1.
 *   Legal ops: ! ~ & ^ | + << >>
 *   Max ops: 24
 *   Rating: 3
 */
int isLessOrEqual(int x, int y) {
 //1)x<0, y>0
 //2)x and y have same signed, and x - y is negative
 //3)x == y
  int res = x + (~y + 1);
  int flag1 = x & (~y);//x<0 y >0
  int t = x ^ y;
  int flag2 = (~t) & res;
  return (((flag1 | flag2)>>31) & 1) | (!t); 
}
```

#	logicalNeg
实现！的功能。思路是判断x是不是0,观察到只有0和Tmin是减0大于0,减1小于0,所以用x分别减去0和1,通过异或最高位来判断是否是0,同时去掉tmin的特殊情况即可。
```C
/* 
 * logicalNeg - implement the ! operator, using all of 
 *              the legal operators except !
 *   Examples: logicalNeg(3) = 0, logicalNeg(0) = 1
 *   Legal ops: ~ & ^ | + << >>
 *   Max ops: 12
 *   Rating: 4 
 */
int logicalNeg(int x) {
//0-1小于0最高位为1,0最高位为0。
//特殊情况是Tmin。
  int res1 = x + (~1 + 1);
  int flag1 = ((res1 ^ x)>>31) & 1;
  int flag2 = (x>>31)&1;
  return (flag2^1) & flag1;
}
```

#	howManyBits
判断最少需要多少位二进制来表示x。使用二分法快速查找。比如如果x>8,那么至少需要3位来表示x，所以这时候可以将x右移3位，继续判断剩下还有多少个1。对正数而言，这题等价于求最高位1出现的位置，这等价于求负数的最高位0出现的位置，所以可以预处理一下。
```C
/* howManyBits - return the minimum number of bits required to represent x in
 *             two's complement
 *  Examples: howManyBits(12) = 5
 *            howManyBits(298) = 10
 *            howManyBits(-5) = 4
 *            howManyBits(0)  = 1
 *            howManyBits(-1) = 1
 *            howManyBits(0x80000000) = 32
 *  Legal ops: ! ~ & ^ | + << >>
 *  Max ops: 90
 *  Rating: 4
 */
int howManyBits(int x) {
	//binary search
  //find the most significant bit of 1 for positive number is equal to find the most significant bit of 0 for negtive number
  int sign, bit16, bit8, bit4, bit2, bit1, bit0;
  sign = x>>31;
  x = (~x & sign) | (~sign & x);
  bit16 = !!(x>>16) << 4;
  x = x >> bit16;
  bit8 = !!(x>>8) <<3;
  x = x >> bit8;
  bit4 = !!(x>>4) << 2;
  x = x >> bit4;
  bit2 = !!(x>>2) << 1;
  x = x >> bit2;
  bit1 = !!(x>>1);
  x = x >> bit1;
  bit0 = x;
  return bit16 + bit8 + bit4 + bit2 + bit1 + bit0 + 1;
}
```

#	floatScale2
浮点型数字运算的关键是掌握其编码格式，只要掌握了编码格式，剩下的就好办了。
```C
//float
/* 
 * floatScale2 - Return bit-level equivalent of expression 2*f for
 *   floating point argument f.
 *   Both the argument and result are passed as unsigned int's, but
 *   they are to be interpreted as the bit-level representation of
 *   single-precision floating point values.
 *   When argument is NaN, return argument
 *   Legal ops: Any integer/unsigned operations incl. ||, &&. also if, while
 *   Max ops: 30
 *   Rating: 4
 */
unsigned floatScale2(unsigned uf) {
	if(uf == 0 || uf == (1 << 31))
		return uf;
	if(((uf >> 23) & 0xff) == 0xff)
		return uf;
	if(((uf >> 23) & 0xff) == 0x00)
		return ((uf & 0x007FFFFF) << 1) | ((1 << 31) & uf);
	return uf + (1 << 23);
}
```

#	floatFloat2Int
```C
/* 
 * floatFloat2Int - Return bit-level equivalent of expression (int) f
 *   for floating point argument f.
 *   Argument is passed as unsigned int, but
 *   it is to be interpreted as the bit-level representation of a
 *   single-precision floating point value.
 *   Anything out of range (including NaN and infinity) should return
 *   0x80000000u.
 *   Legal ops: Any integer/unsigned operations incl. ||, &&. also if, while
 *   Max ops: 30
 *   Rating: 4
 */
int floatFloat2Int(unsigned uf) {
	int sign = (uf >> 31) & 0x1;
	int e = (uf >> 23) & 0xFF;
	int frac = uf & 0x7FFFFF;
	
	int exponent = e - 127;
	int newFrac = 0x1000000 + frac;
	int shifted;
	
	if(exponent < 0 || e == 0)
		return 0;
	if(exponent >= 31 || e == 0xFF)
		return 0x80000000;
		
	if(exponent > 24)
		shifted = newFrac << (exponent - 24);
	else 
		shifted = newFrac >> (24 - exponent);
		
	if(sign)
		shifted = -shifted;
  return shifted;
}
```

#	floatPower2
```C
/* 
 * floatPower2 - Return bit-level equivalent of the expression 2.0^x
 *   (2.0 raised to the power x) for any 32-bit integer x.
 *
 *   The unsigned value that is returned should have the identical bit
 *   representation as the single-precision floating-point number 2.0^x.
 *   If the result is too small to be represented as a denorm, return
 *   0. If too large, return +INF.
 * 
 *   Legal ops: Any integer/unsigned operations incl. ||, &&. Also if, while 
 *   Max ops: 30 
 *   Rating: 4
 */
unsigned floatPower2(int x) {
	if(x < -150)
		return 0;
	if(x <= -127){
		int shiftAmount = -x - 127;
		int frac = 1 << shiftAmount;
		return frac;
	}	
	if(x <= 127){
		int e = (x + 127) <<23;
		return e;
	}
  return 0xFF << 23;
}
```

#	踩坑&总结
1.	补码加减法：直接用两个数字的`补码`进行加减，然后只保留最低的w位就行了（w是32或者64，也即是位的数量）。  
2.	8|0不是1，8||0才是1，或者说1&8等于0，相当于是0001&1000，结果当然是0啦！！  
3.	注意& | 和 && ||的区别，一个是对每一位的运算，一个是逻辑运算，比如1&8=0,1&&8=1，别弄混了！  

