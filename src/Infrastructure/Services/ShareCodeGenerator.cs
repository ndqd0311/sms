using Application.Common.Interfaces;

namespace Infrastructure.Services;

public class ShareCodeGenerator : IShareCodeGenerator
{
    public string Generate()
    {
        return Ulid.NewUlid().ToString();
    }
}
