import subprocess
from flask import Flask, request, render_template, redirect, url_for
import string
import os
import hashlib


alphabet = list(string.ascii_lowercase)
alphabet.extend([' '])
num = '0123456789'
alphabet.extend(num)
command_list = ['flag','cat','chmod','head','tail','less','awk','more','grep']


print(alphabet)