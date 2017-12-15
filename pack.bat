echo "enviroment require: git(添加到path中)，npm，python(32位)，virtualenv，Microsoft Visual C++ 2015 Redistributable (x86)"

echo "start build back"

RMDIR /S /Q .backend

git clone git@54.223.70.246:data-management/data-manager-back-end.git .backend
cd .backend

virtualenv venv
call .\venv\Scripts\activate.bat
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple asn1crypto==0.22.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple bcrypt==3.1.3
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple certifi==2017.7.27.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple cffi==1.10.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple chardet==3.0.4
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple cryptography==2.0.2
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple future==0.16.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple idna==2.5
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple iso8601==0.1.12
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple ntlm-auth==1.0.6
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple paramiko==2.2.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple psutil==5.4.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyasn1==0.3.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pycparser==2.18
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple PyNaCl==1.1.2
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple PyYAML==3.12
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyzmq==16.0.2
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests==2.18.4
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests-ntlm==1.1.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple serial==0.0.15
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple six==1.10.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple tinydb==3.3.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple urllib3==1.22
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple WMI==1.4.9
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple wrapcache==1.0.8
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple xlrd==1.0.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple xlwt==1.2.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple xmltodict==0.11.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple numpy==1.13.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple scipy==1.0.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pandas==0.21.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyinstaller==3.3

RMDIR /S /Q build\backend
RMDIR /S /Q ..\dist\backend

venv\Scripts\pyinstaller --hidden-import=scipy._lib.messagestream --hidden-import=pandas._libs.tslibs.timedeltas --paths venv\Lib\site-packages\scipy\extra-dll --add-data config\*;config --distpath ..\dist -y -n backend  .\run.py

cd ..

echo "start build font"

call npm i
call npm rebuild zeromq --runtime=electron --target=1.6.11
call npm run build:win32