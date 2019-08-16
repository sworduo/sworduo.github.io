---
title: 分布式入门篇（一）
date: 2019-03-06 16:08:06
tags: 分布式
categories: 分布式
copyright: true
---

{% asset_img head.jpg %}
分布式编程是一门关于在多台机器上实现，在一台机器上可以解决的问题，的哲学。 一般情况下，计算机系统有两种需要完成的基本任务：1.**存储**；2.**计算**，事实上，如果你拥有无限的内存以及无限的研发时间，我们根本不需要分布式（只考虑计算任务的情况），然而这很明显是不可能的事情。所以，我们很自然地就想通过增加机器来解决大数据问题。然而不幸的是，无脑增加机器不总是能提升解决问题的速度，特别是当机器数量达到一定程度时，由于网络通信时间的消耗，以及复制等各种操作，单纯的增加机器很难提升整个分布式集群的计算能力。所以研究分布式算法，特别是研究如何高效的整合多台机器以提供更加强有力的计算能力的方法，是非常有必要的。
<!-- more -->
<center><font size=6>[Chapter1--Distributed systems at a high level](http://book.mixu.net/distsys/intro.html)<font></center>

	author:sworduo 	date:Feb 25, Mon, 2019
[参考](https://juejin.im/entry/5881c6351b69e60058d003b0):袖珍分布式系统（一）


#	scalability and other good things
许多问题在小规模下是很好解决的，但是同样的问题扩展到较大规模时就很容易让人感到绝望。比如让你去数一间房间里的人数，那时轻而易举的事情，但是让你去数一个国家的人数，难度就上天了。所以分布式系统要解决的第一个问题是规模的问题。具体来说，我们希望我们所设计的分布式系统在数据规模变大的情况下仍然游刃有余，至少，不能出现数量规模增长之后，计算能力陡然下降的情况，要能适应数据增大规模扩张的场景。有三种典型的scalability：
*	size scalability:随着计算节点的增加，系统的计算能力也呈线性的增加，并且不会出现延迟变大的情况。
*	geographic scalability:能够在不同地方设立不同的数据中心，使得在南极和北极查询的速度都是一样的快，数据中心之间的数据延迟也应该很小才对。
*	administrative scalability:简单来说，就是当机器增加时，不能引入额外的管理成本（比如说管理机器和工作机器之间的比例，而不是管理机器的数量）。  
>有两个重要指标:1.**performance**和2.**availability**来衡量系统的性能。

##	performance(and latency)
performan主要由以下三点来体现：
*	给定一定数量的工作，其响应时间应该很短（延迟很小）。
*	高吞吐率（加工时间）
*	低的计算资源使用率。（就是用尽可能少的资源完成尽可能多的事情）
>以上三点很难兼得，然而大家普遍关注低延迟的情况，因为延迟时间受限于物理材质，很难通过其他py手段来解决延迟的问题。

##	Latency
*	**什么是Latency**：一个事件从发生到被观察到的时间间隔，比如说从你被僵尸咬了一口，到你真的变成僵尸这一段时期，可以理解为僵尸病毒的潜伏期  
*	**分布式中的latency**：（这个我也不是很懂）加入一个分布式系统仅仅是返回其所存储的数字的和，比如说一个系统存储了1,2,3那么查询这个系统就会返回6。此时latency是指，你写入了一个新的数字4，到客户真正看到这个4给系统带来的变化的时间就叫做latency。当分布式系统内存储的数字不变时，latency应该是0（不考虑网络情况什么的）。
*	**最低延迟时间**：分布式系统中存在着必定会有的延迟时间，就是信息传播的速度以及每次操作中硬件带来的延时。  
>每次查询的最低延迟取决于1.操作本身的延时；2.信息传播的延时。

##	Availability (and fault tolerance)
*	**availability**可以理解为分布式系统的有效时间，或者说是客户可以得到服务的时间，最理想的情况下，一个系统的availability等于开机时间/(开机时间+关机时间），这是没考虑断网等的理想情况。单机的availability就等于其所唯一依赖的机器的availability，而分布式系统的availability则等于所有提供同样服务的机器的availibility。
*	**fault tolerance**是指你给所有考虑到的错误设置相应的处理模式，使得当有给定的错误发生时，能执行相应的处理程序来解决这个错误。显然，你无法tolerate你没有考虑到的错误。就和try catch其实差不多，你只能处理你写好的catch的情况。

#	如何提升分布式系统的性能

##	分布式系统的约束
分布式系统主要受到两个物理因素的制约：
*	节点的数量（随着存储和计算能力的需求而提升）
*	节点之间的距离（影响信息传播的速度）  
在上面的限制条件下：  
*	独立节点数量的提升将会提高系统出错的概率（降低availibility和增加administrative costs)
*	独立节点数量的提升可能会增加节点之间的交流成本。（也即是随着节点规模的增加，性能并不能呈线性提升）
*	节点隔得越远，信息传播的最低延迟时间将会越长。
>剔除上面这些基于物理限制的制约因素之后，才真正到达考虑系统设计的范畴。  

　　分布式的performance和availability取决于分布式系统对客户的保证。比如说，一个分布式系统可能能保证在1分钟内让全世界的客户看到某个人在某个地方进行的写操作；又比如，一个分布式保证了某个人在系统上存储的数据可以保存至少一年不丢失；再比如，一个分布式系统可能保证某个大任务的计算时间和其规模呈正比等等。一个分布式系统的性能由其提供的服务和实际的使用体验来保证。    
　　事实上，制约分布式系统性能的还有另外一个重要的因素：设计分布式系统的人的经验和能力。我们常常会遇到错误和异常，错误是指在你预料之中的偏离正确相应的反应，异常是指在你意料之外的系统反应，显然，如果你足够聪明和经验丰富，那么错误就会越多，异常就会越少，而错误是可以提前预料并设置应对措施的，因此系统健壮性也就越高。  
 
##	Abstractions and models
*	**抽象**：隐藏和问题无关的细节，使得系统更加易于研发。一个优秀的抽象能使得系统更加容易让人理解，以及便于开发人员找到问题的关键。
*	**model**：用一种更为精确方式来描述系统的关键特性。
>抽象和模块化的程度的选择是一个trade-off，就好像c语言和python的差别。python隐藏了很多底层操作系统的细节，易于理解和开发，然而效率低下；c语言贴合底层，性能优越，但是对小白不友好。

##	partition and replicate
有两种可以作用于要处理的数据集的方法：
*	**partition**:将数据集划分为互斥的子集，便于并行处理。
*	**replicate**:在多台机器保存同一个数据的副本，用于减少查询时间以及提高容错率。
![partition and replicate](https://raw.githubusercontent.com/sworduo/MIT6.824/master/brief%20introduction/pic/chapter1-1.png "p&r")

###	partition
*	通过限制每个节点所要处理的数据规模以及在同一数据分片内寻找相关数据来提升性能。（有点类似操作系统里面的，先索引分块，再顺序查找）
*	分块之后，各个节点将是相互独立的，不会因为一个节点失效而使得整个系统瘫痪，增加系统允许的失效节点的数量，提高系统的健壮性。  
>一般而言，数据是针对具体任务要求而进行划分的，很难归纳出一个通用的数据划分的方法，所以更进一步的分析将会在后续章节结合具体事例来讲述。总的来说，数据要以系统的访问模式来进行划分。比如说查询较多的任务，尽量把相关的数据放在一起，以提高查询速度；计算较多的任务，尽量把不相关的数据放在一起，提升并行性等等。

###	replicate
replicate就是在多台机器上存储同一个数据的备份，使得更多的服务器参与到计算中。有个大佬说：
···
复制！生活中所有问题的起源和解决方法。
···
有种人类本质复读机的感觉。

*	优势：通过replicate，可以提升系统的扩展性，性能和容错率。
*	劣势：replication也带来了一系列的问题，比如说同一个数据的副本存在于多台机器中，那么当某一台机器上的副本被修改时，其他机器也理应作相应的修改，这就引入了额外的通信成本。

