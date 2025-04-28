
export const register = (username, email, password) => {

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    

    if (users.some(user => user.email === email || user.username === username)) {
      throw new Error('User already exists with this email or username');
    }
    

    const newUser = { 
      id: Date.now().toString(), 
      username, 
      email, 
      password, 
      preferences: {
        jobType: [],
        location: '',
        salary: '',
        keySkills: [],
        industries: []
      },
      createdAt: new Date().toISOString() 
    };
    

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    

    const { password: _, ...userWithoutPassword } = newUser;
    

    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { user: userWithoutPassword };
  };
  
  export const login = (email, password) => {

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    

    const { password: _, ...userWithoutPassword } = user;
    

    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return { user: userWithoutPassword };
  };
  
  export const logout = () => {
    localStorage.removeItem('currentUser');
  };
  
  export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('currentUser');
  };
  
  export const updateUserPreferences = (preferences) => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not logged in');
    }
    

    const updatedUser = {
      ...currentUser,
      preferences: {
        ...currentUser.preferences,
        ...preferences
      }
    };
    

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? 
      {...user, preferences: {...user.preferences, ...preferences}} : 
      user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    return updatedUser;
  };