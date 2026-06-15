import os

base_path = r"d:\NamaMedical\backend\dotnet\NamaMedical.Api"
controllers_path = os.path.join(base_path, "Controllers")

os.makedirs(controllers_path, exist_ok=True)

groups = [
    ("01", "Cardiology"),
    ("02", "Pulmonology"),
    ("03", "GastroHepato"),
    ("04", "Nephrology"),
    ("05", "HematoOncology"),
    ("06", "EndocrineDiabetes"),
    ("07", "RheumImmunology"),
    ("08", "InfectiousDiseases"),
    ("09", "Dermatology"),
    ("10", "GeneralSurgery"),
    ("11", "CtsVascularSurgery"),
    ("12", "NeurosurgerySpine"),
    ("13", "Orthopedics"),
    ("14", "Ophthalmology"),
    ("15", "Ent"),
    ("16", "Urology"),
    ("17", "PlasticBurns"),
    ("18", "Obgyn"),
    ("19", "NeonatalPediatrics"),
    ("20", "PediatricSubspec"),
    ("21", "RadiologyImaging"),
    ("22", "Laboratories"),
    ("23", "FunctionalDiagnostics"),
    ("24", "EmergencyDepartment"),
    ("25", "IntensiveCare"),
    ("26", "AnesthesiaPain"),
    ("27", "RehabPt"),
    ("28", "RadiationPharmacy"),
    ("29", "IntegrativeMedicine"),
    ("30", "Nursing"),
    ("31", "Nutrition"),
    ("32", "SocialPsych"),
    ("33", "LogisticsIt"),
    ("34", "SecuritySafety"),
    ("35", "Executive"),
    ("36", "QualityAccreditation"),
    ("37", "EducationResearch"),
    ("38", "HrAdmin"),
    ("39", "CentersOfExcellence"),
    ("40", "RareAdvanced")
]

csproj = """<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
  </ItemGroup>
</Project>
"""
with open(os.path.join(base_path, "NamaMedical.Api.csproj"), "w", encoding="utf-8") as f:
    f.write(csproj)

program_cs = """using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
"""
with open(os.path.join(base_path, "Program.cs"), "w", encoding="utf-8") as f:
    f.write(program_cs)

controller_tpl = """using Microsoft.AspNetCore.Mvc;

namespace NamaMedical.Api.Controllers
{{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class {name}Controller : ControllerBase
    {{
        [HttpGet("orders")]
        public IActionResult GetOrders()
        {{
            return Ok(new string[] {{ }});
        }}

        [HttpPost("orders")]
        public IActionResult CreateOrder([FromBody] object order)
        {{
            return Created("", order);
        }}

        [HttpGet("results")]
        public IActionResult GetResults([FromQuery] string patientId)
        {{
            return Ok(new string[] {{ }});
        }}
    }}
}}
"""

for num, name in groups:
    with open(os.path.join(controllers_path, f"{name}Controller.cs"), "w", encoding="utf-8") as f:
        f.write(controller_tpl.format(name=name))

print("Successfully generated ASP.NET Core Web API scaffold with 40 department controllers.")
