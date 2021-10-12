import {api} from '../../../services/api'
import { FoodsContainer } from './styles';
import { Header } from '../../../components/Header';
import { useEffect, useState } from 'react';
import { ModalAddFood } from '../../../components/ModalAddFood';
import { ModalEditFood } from '../../../components/ModalEditFood';
import {Food} from '../../../components/Food';

interface FoodType {
    name: string;
    description: string;
    price: string;
    image: string;
}

interface NewFood {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    available : boolean
}





export function Dashboard() {
    const [foods, setFoods] = useState<NewFood[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<NewFood>({} as NewFood);

    useEffect(()=> {
        api.get('/foods').then(response => setFoods(response.data))
    },[])

    function handleOpenModal() {
        setModalOpen(!modalOpen)
    }

    async function handleAddFood(
      food: NewFood
    ) {
      try {
        const response = await api.post('/foods', {
          ...food,
          available: true,
        });
  
        setFoods([...foods, response.data]);
      } catch (err) {
        console.log(err);
      }
    }

    async function handleUpdateFood (food:FoodType): Promise<void>{
        try {
          const foodUpdated = await api.put(
            `/foods/${editingFood.id}`,
            { ...editingFood, ...food },
          );
    
          const foodsUpdated = foods.map(f =>
            f.id !== foodUpdated.data.id ? f : foodUpdated.data,
          );
    
          setFoods(foodsUpdated);
        } catch (err) {
          console.log(err);
        }
      }

    function toggleEditModal() {
        setEditModalOpen(!editModalOpen);
    }
    
    function handleEditFood (food: NewFood) {
        setEditModalOpen(true);
        setEditingFood(food)
    }

    async function handleDeleteFood(id : number){
        await api.delete(`/foods/${id}`);
    
        const foodsFiltered = foods.filter(food => food.id !== id);
    
        setFoods(foodsFiltered );
    }
    

    return (
        <>
            <Header openModal={handleOpenModal}/>
            <ModalAddFood
            isOpen={modalOpen}
            setIsOpen={handleOpenModal}
            handleAddFood={handleAddFood}
            />
             <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />
        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
        </>
    )
}