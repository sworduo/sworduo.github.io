
---
title: 热门文章
comments: false
keywords: top,文章阅读量排行榜
---
<div id="top"></div>
<script src="https://cdn1.lncld.net/static/js/av-core-mini-0.6.4.js"></script>
<script>AV.initialize(Ja6j11Iyo36Mmrc5INxiYSIx-gzGzoHsz, v6xwUOCxJcVCwOdrB7ufT9gO);</script>
<script type="text/javascript">
  var time=0
  var title=""
  var url=""
  var query = new AV.Query('Counter');
  query.notEqualTo('id',0);
  query.descending('time');
  query.limit(10);
  query.find().then(function (todo) {
    for (var i=0;i<1000;i++){
      var result=todo[i].attributes;
      time=result.time;
      title=result.title;
      url=result.url;
      var content="<a href='"+"https://username.github.io"+url+"'>"+title+"</a>"+"<br>"+"<font color='#fff'>"+"阅读次数："+time+"</font>"+"<br><br>";
      document.getElementById("top").innerHTML+=content
    }
  }, function (error) {
    console.log("error");
  });
</script>