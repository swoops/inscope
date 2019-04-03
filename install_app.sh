NAME=inscope
APP_MANIFEST=./src/app/${NAME}.json
APP_EXE=$(realpath ./src/app/${NAME}.py )
INSTALL_DIR=~/.mozilla/native-messaging-hosts/
INSTALL_FILE=~/.mozilla/native-messaging-hosts/${NAME}.json

if [[ ! -d ${INSTALL_DIR} ]]; then 
	mkdir ${INSTALL_DIR}
	echo "Creating instalation directory: ${INSTALL_DIR}"
fi

echo "Copying manifest file to install dir"
echo cp ${APP_MANIFEST} ${INSTALL_DIR}
cp ${APP_MANIFEST} ${INSTALL_DIR}
sed -i "s:REPLACE_ME_PLEASE:${APP_EXE}:"  $INSTALL_FILE
grep "${APP_EXE}" $INSTALL_FILE
echo "Finished"
