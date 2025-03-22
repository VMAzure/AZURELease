# STAGE 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copia solo il file .csproj per cache intelligente
COPY AZURELease.csproj ./
RUN dotnet restore ./AZURELease.csproj

# Copia tutto il progetto
COPY . ./

# Compila in modalità Release
RUN dotnet publish ./AZURELease.csproj -c Release -o out

# STAGE 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "AZURELease.dll"]
