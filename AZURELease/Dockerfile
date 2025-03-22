# STAGE 1: Build
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copia il file .csproj
COPY AZURELease.csproj ./

# Ripristina i pacchetti
RUN dotnet restore ./AZURELease.csproj

# Copia tutti i file di progetto
COPY . .

# Pubblica il progetto
RUN dotnet publish ./AZURELease.csproj -c Release -o /app/out

# STAGE 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Avvio
ENTRYPOINT ["dotnet", "AZURELease.dll"]
