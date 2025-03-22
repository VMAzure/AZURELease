# STAGE 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY AZURELease.csproj ./
RUN dotnet restore ./AZURELease.csproj

COPY . .
RUN dotnet publish ./AZURELease.csproj -c Release -o /app/out

# STAGE 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "AZURELease.dll"]