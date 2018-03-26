s; �ýű�ʹ�� HM VNISEdit �ű��༭���򵼲���

; ��װ�����ʼ���峣��
!define PRODUCT_NAME "gooal"
!define PRODUCT_VERSION "1.0"
!define PRODUCT_PUBLISHER "joke"
!define PRODUCT_WEB_SITE "http://www.gooalgene.com"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\data-manager-desktop.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; ------ MUI �ִ����涨�� (1.67 �汾���ϼ���) ------
!include "MUI.nsh"

; MUI Ԥ���峣��
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; ��ӭҳ��
!insertmacro MUI_PAGE_WELCOME
; ���Э��ҳ��
!insertmacro MUI_PAGE_LICENSE "data-manager-front-end\nsislicense.txt"
; ��װĿ¼ѡ��ҳ��
!insertmacro MUI_PAGE_DIRECTORY
; ��װ����ҳ��
!insertmacro MUI_PAGE_INSTFILES
; ��װ���ҳ��
!define MUI_FINISHPAGE_RUN "$INSTDIR\main\data-manager-desktop.exe"
!insertmacro MUI_PAGE_FINISH

; ��װж�ع���ҳ��
!insertmacro MUI_UNPAGE_INSTFILES

; ��װ�����������������
!insertmacro MUI_LANGUAGE "SimpChinese"

; ��װԤ�ͷ��ļ�
!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS
; ------ MUI �ִ����涨����� ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "Setup.exe"
InstallDir "$PROGRAMFILES\gooal"
InstallDirRegKey HKLM "${PRODUCT_UNINST_KEY}" "UninstallString"
ShowInstDetails show
ShowUnInstDetails show

Section "MainSection" SEC01
  SetOutPath "$INSTDIR\main"
  SetOverwrite ifnewer
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\views_resources_200_percent.pak"
  CreateDirectory "$SMPROGRAMS\gooal"
  CreateShortCut "$SMPROGRAMS\gooal\gooal.lnk" "$INSTDIR\main\data-manager-desktop.exe"
  CreateShortCut "$DESKTOP\gooal.lnk" "$INSTDIR\main\data-manager-desktop.exe"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\version"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\ui_resources_200_percent.pak"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\snapshot_blob.bin"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\pdf_viewer_resources.pak"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\node.dll"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\natives_blob.bin"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\LICENSES.chromium.html"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\LICENSE"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\libGLESv2.dll"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\libEGL.dll"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\icudtl.dat"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\ffmpeg.dll"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\data-manager-desktop.exe"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\d3dcompiler_47.dll"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\content_shell.pak"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\content_resources_200_percent.pak"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\blink_image_resources_200_percent.pak"
  File "data-manager-front-end\build\data-manager-desktop-win32-x64\app_log"
SectionEnd

Section -AdditionalIcons
  SetOutPath $INSTDIR
  WriteIniStr "$INSTDIR\${PRODUCT_NAME}.url" "InternetShortcut" "URL" "${PRODUCT_WEB_SITE}"
  CreateShortCut "$SMPROGRAMS\gooal\Website.lnk" "$INSTDIR\${PRODUCT_NAME}.url"
  CreateShortCut "$SMPROGRAMS\gooal\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\main\data-manager-desktop.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\main\data-manager-desktop.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

/******************************
 *  �����ǰ�װ�����ж�ز���  *
 ******************************/

Section Uninstall
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\main\app_log"
  Delete "$INSTDIR\main\blink_image_resources_200_percent.pak"
  Delete "$INSTDIR\main\content_resources_200_percent.pak"
  Delete "$INSTDIR\main\content_shell.pak"
  Delete "$INSTDIR\main\d3dcompiler_47.dll"
  Delete "$INSTDIR\main\data-manager-desktop.exe"
  Delete "$INSTDIR\main\ffmpeg.dll"
  Delete "$INSTDIR\main\icudtl.dat"
  Delete "$INSTDIR\main\libEGL.dll"
  Delete "$INSTDIR\main\libGLESv2.dll"
  Delete "$INSTDIR\main\LICENSE"
  Delete "$INSTDIR\main\LICENSES.chromium.html"
  Delete "$INSTDIR\main\natives_blob.bin"
  Delete "$INSTDIR\main\node.dll"
  Delete "$INSTDIR\main\pdf_viewer_resources.pak"
  Delete "$INSTDIR\main\snapshot_blob.bin"
  Delete "$INSTDIR\main\ui_resources_200_percent.pak"
  Delete "$INSTDIR\main\version"
  Delete "$INSTDIR\main\views_resources_200_percent.pak"

  Delete "$SMPROGRAMS\gooal\Uninstall.lnk"
  Delete "$SMPROGRAMS\gooal\Website.lnk"
  Delete "$DESKTOP\gooal.lnk"
  Delete "$SMPROGRAMS\gooal\gooal.lnk"

  RMDir "$SMPROGRAMS\gooal"
  RMDir "$INSTDIR\main"

  RMDir "$INSTDIR"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd

#-- ���� NSIS �ű��༭�������� Function ���α�������� Section ����֮���д���Ա��ⰲװ�������δ��Ԥ֪�����⡣--#

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "��ȷʵҪ��ȫ�Ƴ� $(^Name) ���������е������" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) �ѳɹ��ش����ļ�����Ƴ���"
FunctionEnd
