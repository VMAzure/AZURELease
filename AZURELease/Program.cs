using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AZURELease API", Version = "v1" });
});


// Abilita i file statici
var app = builder.Build();
app.UseStaticFiles();

// Se siamo in modalità di sviluppo, abilita Swagger (ma non come homepage)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Reindirizza la homepage a index.html
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("/html/index.html");




app.Run();
