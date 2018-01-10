echo "start build back"

RMDIR /S /Q .backend

git clone http://54.223.70.246:9000/data-management/data-manager-back-end.git .backend
cd .backend
git checkout with_tornado
echo "down backend code success"
virtualenv venv
call .\venv\Scripts\activate.bat

pip install -i https://pypi.tuna.tsinghua.edu.cn/simple certifi==2017.7.27.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple chardet==3.0.4
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple future==0.16.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple paramiko==2.2.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple psutil==5.4.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple requests==2.18.4
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple serial==0.0.15
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple six==1.10.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple tinydb==3.3.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple urllib3==1.22
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple WMI==1.4.9
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple wrapcache==1.0.8
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple numpy==1.13.1
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple scipy==1.0.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pandas==0.21.0
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple tornado==4.5.2
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyinstaller==3.3

RMDIR /S /Q build\backend
RMDIR /S /Q ..\dist\backend

venv\Scripts\pyinstaller --hidden-import=scipy._lib.messagestream --hidden-import=pandas._libs.tslibs.timedeltas --paths venv\Lib\site-packages\scipy\extra-dll --add-data config\*;config --add-data data\*;data --distpath ..\dist -y -n backend  .\run.py

cd ..
