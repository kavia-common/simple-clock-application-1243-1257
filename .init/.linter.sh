#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-clock-application-1243-1257/frontend_clock_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

