#!/bin/bash

# --------------------------------------------------------- #
#
#    successful case: Post then Get
#
# --------------------------------------------------------- #

# post a new data
result=$(curl -X POST -H "Content-Type:application/json" https://api.awstiny.com/modify \
        -d '{"url": "https://www.google.com", "expireAt": "2030-02-08 09:20:41" }')

# extract the shortened url
IFS='"' #setting comma as delimiter
read -a strarr <<<"$result" #reading str as an array as tokens separated by IFS
short_url=${strarr[7]}

# get the short url
get_result=$(curl -L -X GET ${short_url})

# check if the redirected url contains key word
SUB="google.com"
if [[ "$get_result" == *"$SUB"* ]]; then
  echo "Case: "Post then Get" success!"
else
  echo "Case: "Post then Get" fail!"
fi


# --------------------------------------------------------- #
#
#    successful case: Post, Get, Delete, then Get
#
# --------------------------------------------------------- #

# post a new data
result=$(curl -X POST -H "Content-Type:application/json" https://api.awstiny.com/modify \
        -d '{"url": "https://www.google.com", "expireAt": "2030-02-08 09:20:41" }')

# extract the shortened url
IFS='"' #setting comma as delimiter
read -a strarr <<<"$result"
short_url=${strarr[7]}
short_url_id=${strarr[3]}

# get the short url
get_result=$(curl -L -X GET ${short_url})

# check if the redirected url contains key word
SUB="google.com"
#echo $get_result
if [[ "$get_result" == *"$SUB"* ]]; then
  echo "Case: "Post, Get, Delete, then Get" successed in 1st Get!"
else
  echo "Case: "Post, Get, Delete, then Get" failed in 1st Get!"
fi

# delete this data
url="https://api.awstiny.com/modify/${short_url_id}"
result=$(curl -X DELETE ${url})

# check if return 200 (success)
SUB="200"
if [[ "$result" == *"$SUB"* ]]; then
  echo "Case: "Post, Get, Delete, then Get" successed in delete!"
else
  echo "Case: "Post, Get, Delete, then Get" failed in delete!"
fi

# get the short url again
get_result=$(curl -L -X GET ${short_url})
SUB="Failed to redirect to"
if [[ "$get_result" == *"$SUB"* ]]; then
  echo "Case: "Post, Get, Delete, then Get" successed in 2nd Get!"
else
  echo "Case: "Post, Get, Delete, then Get" failed in 2nd Get!"
fi


# --------------------------------------------------------- #
#
#    failed case: Get the url not exists
#
# --------------------------------------------------------- #

# get the short url
get_result=$(curl -L -X GET https://api.awstiny.com/t/fake)

# check if the redirected url contains key word
SUB="Failed to redirect to"
#echo $get_result
if [[ "$get_result" == *"$SUB"* ]]; then
  echo "Case: "Get the url not exists" successed!"
else
  echo "Case: "Get the url not exists" failed in 1st Get!"
fi