
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
hexo.extend.helper.register('related_posts', function(currentPost, allPosts){
    var relatedPosts = [];
    currentPost.tags.forEach(function (tag) {
        allPosts.forEach(function (post) {
            if (isTagRelated(tag.name, post.tags)) {
                var relatedPost = {
                    title: post.title,
                    path: post.path,
                    weight: 1
                };
                var index = findItem(relatedPosts, 'path', post.path);
                if (index != -1) {
                    relatedPosts[index].weight += 1;
                } else{
                    if (currentPost.path != post.path) {
                        relatedPosts.push(relatedPost);
                    };
                };
            };
        });
    });
    if (relatedPosts.length == 0) {return ''};
    var result = '<h3> 相关文章：</h3><ul class="related-posts">';
    relatedPosts = relatedPosts.sort(compare('weight'));
    for (var i = 0; i < Math.min(relatedPosts.length, 10); i++) {
        result += '<li><a href="/' + relatedPosts[i].path + '">' + relatedPosts[i].title + '</a></li>';
    };
    result += '</ul>';
    // console.log(relatedPosts);
    return result;
});
hexo.extend.helper.register('echo', function(path){
  return path;
});
function isTagRelated (tagName, TBDtags) {
    var result = false;
    TBDtags.forEach(function (tag) {
        if (tagName == tag.name) {
            result = true;
        };
    })
    return result;
}
function findItem (arrayToSearch, attr, val) {
    for (var i = 0; i < arrayToSearch.length; i++) {
        if (arrayToSearch[i][attr] == val) {
            return i
        };
    };
    return -1;
}
function compare (attr) {
    return function (a, b) {
        var val1 = a[attr];
        var val2 = b[attr];
        return val2 - val1;
    }
}