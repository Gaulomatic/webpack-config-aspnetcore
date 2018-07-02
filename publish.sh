#!/bin/bash

# Runtime-Identifier:
# https://docs.microsoft.com/de-de/dotnet/core/rid-catalog
dotnet publish Logixware.AspNet.Angular.csproj --self-contained --configuration Release --runtime osx.10.13-x64
#dotnet publish Jmv.Logistics.Web.csproj --self-contained --configuration Release --runtime ubuntu.16.04-x64
