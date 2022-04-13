const NodeRSA = require('node-rsa');
// 创建 NodeRSA 加密器的实例对象
// b：加密长度
let key = new NodeRSA({b: 512});
// 创建一对公钥和私钥
// key.generateKeyPair(2048, 65537)
// // 通过key导出公钥和私钥
// const pk = key.exportKey('pkcs1-public')
// const sk = key.exportKey('pkcs1-private')
//
// // console.log(pk)
// // console.log(sk)
//
// // 通过公钥加密数据
// let r = key.encrypt('我爱中国')
// console.log(r.toString())
//
// // 通过私钥解密
// // decrypt 的参数是一个字符串或buffer对象
// r = key.decrypt(r)
// console.log(r.toString())

key.importKey(`-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAiMYS/9/X1aR1D+zluqaFFGHJa2Iy0u5n2qF3reqoX9ZCwX7YZ27i
croJbojLaqxs5MS7M9qoSwxYtWWF9EomIGAX2qkIizExvPeHQpv8uFu8jQbOhDuU
RzfvtqMJkBmmunYKKbWAdMnfXgjOnSUAkaK2mtBDsaqiHZN9GgAKMUwi6OAChlVE
f+PkcAMbG4hwGqMpIj0TZ0SXGm5o5rrgJ0G+4VK9CduQsoXAEqdzADYLrW9sOOhi
nSlpFmcXXMap92edcwwt4YpYWq7LmDh43hLUW5/S666yg4sYOLzq2Z/u97sEbOr/
qCVwiE8th4w0hs4IDBwGJm4KHPBByAhyMwIDAQAB
-----END RSA PUBLIC KEY-----`, 'pkcs1-public');

let r = key.encrypt('hello World \n 你好世界');
console.log(r);

key = new NodeRSA({b: 512});
key.importKey(`-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAiMYS/9/X1aR1D+zluqaFFGHJa2Iy0u5n2qF3reqoX9ZCwX7Y
Z27icroJbojLaqxs5MS7M9qoSwxYtWWF9EomIGAX2qkIizExvPeHQpv8uFu8jQbO
hDuURzfvtqMJkBmmunYKKbWAdMnfXgjOnSUAkaK2mtBDsaqiHZN9GgAKMUwi6OAC
hlVEf+PkcAMbG4hwGqMpIj0TZ0SXGm5o5rrgJ0G+4VK9CduQsoXAEqdzADYLrW9s
OOhinSlpFmcXXMap92edcwwt4YpYWq7LmDh43hLUW5/S666yg4sYOLzq2Z/u97sE
bOr/qCVwiE8th4w0hs4IDBwGJm4KHPBByAhyMwIDAQABAoIBACTsM9zXdNC74M43
yZylr29dJp7Sl53Rtj+TL1fH7URR9xt9PrZNfNwz1K/+Rcu6WHs5kL/i22PHJXty
uMLF8Zzz0/y3fRL2aNL2j5Evwv2R5ki7+axA2TqQoynOwZohEp1rmDrCQLdGeAJO
plhN0OV/44PPjTa9NZ5+XltSf23nFayh144v99Jn7xn7ij0pPQgFuSM3VZqw2dqk
+7YJ5dEXQMK8zGpO5O0rry7rqg9PA60TC1ufcDs8WaoUX2cy2lrdMyUDLoZUh88d
3EPuFCR8OnKYsnQeLAsQ+H9bSlBkmK0TA2/Iq2KDnHNgsBKyRLWbojuQZJQRd7Wi
isVFwsECgYEA2UemJIVfsAODnmCBreir/xP39Xzc8alT+I8tfpaZxGtzwumE2z+I
KrErXd9YtGS8Xf7284dYeSNAJLoM/HYc2ZzqeJFH8YtmZ9S/zzqPASoBy/Zi7GCr
YWqA1aBY6oTj4Cc/tS/y3incPJrjus7EflNoZPoMZFFT5u4iF4pnLNsCgYEAoSW3
+8DWAbpAplgMRpVDb1RNiUsxWn4BdEylIMqi7wHwVnZdFmpfN4b8yaaeqWFoJ90G
J1Wq0/bdNxI8rlNixgavpMNYpRN6JhENF4sQM8Yel4xCyf8q52RxLQBnGkP3IxsX
sSEgt1rDOjFpUIYo5kzb4vsaVneKIxR+3VJmo4kCgYBB7tMEvBA4Siizc5eGXVdr
9PRGYxhsoLRhdZkZk7ufdffPyqrNGS9JvS9qse6p9vOOFmN7rLN1NvQs8OQl6/V/
N3WTFordSi7ODSoTSTLB6KxY5zBHiGIZEod7y8ePirnXeDGF2sH5FnzFSz8Vnc7U
gpzoH1SJUICET/i6af47BwKBgFiMjWi9MduJKPU+9J/kbUXDoUeMFfaPvuTVKPe3
4YhMHHCmYchrcx7kAgwcjpqsd7tP7I24uUH4KN6WGtn/4ArIqcNzxEYRSdGZFQSW
2bRZbX4BCMJOgJjdzILZ8c2xAyA7Ru2CMqQOL7DObfxdfCPwn/M9398bmMBmBsA/
Az9hAoGAV2HalKh8ieOyu8R/iv2fhK3Zdbdz8ZND/aIjgUq4HMRmEZFeqWctQywM
XMsXwVAjil64PVS2I9ejANSYS7Z96guOge2PpaPQF3Fi5Z6leWY5cLHPosZZ2NHW
YzUn1W+/mVm25sWcN3pn5kcDVc8JD99qP64xhIREoQT9UaNgzTE=
-----END RSA PRIVATE KEY-----`, 'pkcs1-private');

r = key.decrypt(r);

console.log(r.toString());

// axios.post('http://127.0.0.1:1024/account/getPk').then(r => {
//     console.log(r.data);
//     key.importKey(r.data.data, 'pkcs1-public');
//     r = key.encrypt('hello world');
//     console.log(r);
// });

console.log(typeof '123');