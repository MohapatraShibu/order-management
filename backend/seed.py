from .models import MenuItem

MENU_DATA = [
    {"name": "Margherita Pizza", "description": "Classic tomato, mozzarella and fresh basil", "price": 12.99, "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400"},
    {"name": "Cheeseburger", "description": "Veg patty with cheddar, lettuce and tomato", "price": 9.99, "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400"},
    {"name": "Veg Burrito Bowl", "description": "Seasoned rice, black beans, corn, salsa and guacamole", "price": 11.49, "image": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400"},
    {"name": "Caesar Salad", "description": "Romaine lettuce, croutons and Caesar dressing", "price": 8.99, "image": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"},
    {"name": "Hawaiian Pizza", "description": "Loaded with pineapple, sweet corn and mozzarella", "price": 13.99, "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"},
    {"name": "Paneer Tikka Wrap", "description": "Grilled cottage cheese, peppers and mint chutney in a soft tortilla", "price": 10.99, "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400"},
    {"name": "Mushroom Risotto", "description": "Creamy arborio rice with wild mushrooms, parmesan and fresh herbs", "price": 13.49, "image": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400"},
    {"name": "Veggie Burger", "description": "Plant-based patty with fresh veggies", "price": 10.49, "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400"},
    {"name": "Palak Paneer Bowl", "description": "Cottage cheese in creamy spinach gravy, served with steamed rice", "price": 11.99, "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400"},
    {"name": "Falafel Pita Wrap", "description": "Crispy chickpea falafel, lettuce, tomato and tahini in a warm pita", "price": 9.49, "image": "https://tastythriftytimely.com/wp-content/uploads/2023/06/Falafel-Pita-1.jpg"},
]

def seed_menu(db):
    if db.query(MenuItem).count() == 0:
        db.add_all([MenuItem(**d) for d in MENU_DATA])
        db.commit()
