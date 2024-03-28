from pydantic import BaseModel 
from typing import Optional
from datetime import  date
 

class UserBase(BaseModel): 
    name              :str 
    email             :str 
    numeroDeTelephone :str 
    adresse           :str 
    dateNaissance: Optional[date]
     

class userCreate(UserBase):
    hashed_password   :str
    class Config():
        orm_mode=True
 
class Admin(UserBase):
    pass 
class AdminCreate(userCreate):
    pass  
      
class typeUser(userCreate):
    UserType:bool
    class Config():
        orm_mode=True
        
class showuser(BaseModel):
    IDUser           : int  
    name              :str 
    email             :str 
    numeroDeTelephone :str 
    adresse           :str 
    dateNaissance  : date
    typeUser:bool
    
           
                        
class User(showuser):
    IDAdmin : int
    class Config:
        orm_mode = True 
        from_attributes = True 
 
class UpdateUserType(BaseModel):
    typeUser :bool
    class Config:
        orm_mode = True 
        from_attributes = True    
                
     


class UserCreateResponse(BaseModel):
    user: User
    token: str        

class Access_token(BaseModel):
    token: str

class TokenData(BaseModel):
    email: Optional[str] = None
        

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class UpdateInfoUser(BaseModel):
     numeroDeTelephone :str 
     adresse           :str
     username          :str  
         
     
class UsersForUser(BaseModel):
    IDUser :int 
    name:str
    Telephone :str
    Email :str
    NomPoste :str
    NomSiege :str
    NomService : str
    
    
    
    
class UserFilter (BaseModel):
    Mot :str
    Siege : str
    Service : str 
    Poste : str        
         

class GetUsersForUser(BaseModel):
    users : list[UsersForUser]
    Sieges :list[str]
    Services : list[str]
    Postes : list[str]         
    
    
class GetUsersForAdmin(BaseModel):
    users : list[showuser]
    Sieges :list[str]
    Services : list[str]
    Postes : list[str]             