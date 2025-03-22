# STAGE 1: build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copia solo il file di progetto per fare restore
COPY AZURELease.csproj .

RUN dotnet restore AZURELease.csproj

# Ora copia tutto
COPY . .

# Pubblica il progetto in modalità Release
RUN dotnet publish -c Release -o /app/out

# STAGE 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "AZURELease.dll"]
