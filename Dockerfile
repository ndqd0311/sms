# Giai đoạn 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy solution và các file project để restore
COPY StudentManagementSystem.sln ./
COPY src/Web/Web.csproj src/Web/
COPY src/Application/Application.csproj src/Application/
COPY src/Domain/Domain.csproj src/Domain/
COPY src/Infrastructure/Infrastructure.csproj src/Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy toàn bộ mã nguồn
COPY src/ src/

# Build và Publish
WORKDIR /app/src/Web
RUN dotnet publish -c Release -o /out

# Giai đoạn 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /out .

# Cấu hình port (Render sẽ gán cổng qua biến môi trường PORT, ASP.NET Core sẽ tự nhận diện nếu cấu hình đúng)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "Web.dll"]
