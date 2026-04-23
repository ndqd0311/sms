namespace Application.Common.Interfaces.Authentication;

using Domain.Entities;

public interface IJwtProvider
{
    string Generate(Teacher teacher);
}
