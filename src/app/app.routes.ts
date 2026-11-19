import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        title: "Home"
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/Profile/profile/profile.component').then(m => m.ProfileComponent),
        title: "Profile"
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: "settings"
    },
    {
        path: 'address',
        loadComponent: () => import('./features/Adresses/addresses/addresses.component').then(m => m.AddressesComponent),
        title: "Address"
    },
    {
        path: 'payment/:id',
        loadComponent: () => import('./features/Payment/payment/payment.component').then(m => m.PaymentComponent),
        title: "Payment"
    },
    {
        path: 'brands',
        loadComponent: () => import('./features/brands/brands.component').then(m => m.BrandsComponent),
        title: "Brands"
    },
    {
        path: 'subcategory/:id',
        loadComponent: () => import('./features/SubCategory/subcategory/subcategory.component').then(m => m.SubcategoryComponent),
        title: "Category Details"
    },
    {
        path: 'Subcategoryproducts/:id',
        loadComponent: () => import('./features/SubCategoryProducts/subcategoryproducts/subcategoryproducts.component').then(m => m.SubcategoryproductsComponent),
        title: "SubCategory Products"
    },
    {
        path: 'brandsproducts/:id',
        loadComponent: () => import('./features/BrandsProducts/brandsproducts/brandsproducts.component').then(m => m.BrandsproductsComponent),
        title: "Brands Products"
    },
    {
        path: 'cart',
        loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
        title: "Cart"
    },
    {
        path: 'categories',
        loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
        title: "Categories"
    },
    {
        path: 'categoriesproduct/:id',
        loadComponent: () => import('./features/CategoriesProduct/categoriesproduct/categoriesproduct.component').then(m => m.CategoriesproductComponent),
        title: "CategoriesProduct"
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        title: "Login"
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./features/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: "Forgot Password"
    },
    {
        path: 'forgotpassword',
        redirectTo: 'forgot-password',
        pathMatch: 'full'
    },
    {
        path: 'resetcode',
        loadComponent: () => import('./features/resetcode/resetcode.component').then(m => m.ResetcodeComponent),
        title: "Verify Code"
    },
    {
        path: 'reset-code',
        redirectTo: 'resetcode',
        pathMatch: 'full'
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./features/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        title: "Reset Password"
    },
    {
        path: 'resetpassword',
        redirectTo: 'reset-password',
        pathMatch: 'full'
    },
    {
        path: 'allorders',
        loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent),
        title: "Orders"
    },
    {
        path: 'orders',
        redirectTo: 'allorders',
        pathMatch: 'full'
    },
    {
        path: 'p-detailes/:id',
        loadComponent: () => import('./features/p-detailes/p-detailes.component').then(m => m.PDetailesComponent),
        title: "Product Details"
    },
    {
        path: 'register',
        loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent),
        title: "Register"
    },
    {
        path: 'shops',
        loadComponent: () => import('./features/shops/shops.component').then(m => m.ShopsComponent),
        title: "Shops"
    },
    {
        path: 'wishlist',
        loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: "Wishlist"
    },
    {
        path: '**',
        loadComponent: () => import('./Shared/Wildcard/wildcard/wildcard.component').then(m => m.WildcardComponent),
        title: "Not Found"
    },
];