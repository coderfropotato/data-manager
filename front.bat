echo "start build front"

cd build

RMDIR /S /Q data-manager-desktop-win32-x64

cd..

yarn run package:win32


echo "front build successed  ARE YOU OK"