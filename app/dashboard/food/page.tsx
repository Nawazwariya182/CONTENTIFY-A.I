'use client'

import React, { useState } from 'react'
import { getFoodSuggestions, validateRestaurantInput, Restaurant, DishSuggestion, AccompanimentSuggestion } from '@/utils/food'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2, Users, Plus, X, ArrowLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from 'next/link'

export default function FoodSuggestionUI() {
  const [restaurant, setRestaurant] = useState<Restaurant>({ name: '', area: '', cuisineType: '' })
  const [hasPurchased, setHasPurchased] = useState(false)
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [orderedItems, setOrderedItems] = useState<string[]>([])
  const [newOrderedItem, setNewOrderedItem] = useState('')
  const [dishes, setDishes] = useState<DishSuggestion[]>([])
  const [accompaniments, setAccompaniments] = useState<AccompanimentSuggestion[]>([])
  const [combinations, setCombinations] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateRestaurantInput(restaurant, numberOfPeople)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setDishes([])
    setAccompaniments([])
    setCombinations([])
    setIsLoading(true)
    try {
      const result = await getFoodSuggestions(restaurant, hasPurchased, numberOfPeople, orderedItems)
      if (result.error) {
        setError(result.error)
      } else {
        setDishes(result.dishes)
        setAccompaniments(result.accompaniments)
        setCombinations(result.combinations)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addOrderedItem = () => {
    if (newOrderedItem.trim() !== '') {
      setOrderedItems([...orderedItems, newOrderedItem.trim()])
      setNewOrderedItem('')
    }
  }

  const removeOrderedItem = (index: number) => {
    setOrderedItems(orderedItems.filter((_, i) => i !== index))
  }

  return (
    <div>
    <Card className="w-full max-w-2xl mx-auto mt-[120px] mb-[76px] sm:mt-[50px]">
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className="text-2xl">AI Food Suggestion</CardTitle>
      <Link href="/dashboard" >
        <Button className="bg-prim mx-[500px] sm:mx-[30px] mt-2 mb-[-20px] hover:bg-back hover:text-acc hover:border-2 hover:border-prim transition-all w-20" style={{ cursor: 'url(/poin.png), auto' }}>
          <ArrowLeft className="text-xl" /> Back
        </Button>
      </Link>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="restaurant-name">Restaurant Name</Label>
              <Input
                id="restaurant-name"
                value={restaurant.name}
                onChange={(e) => setRestaurant(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter restaurant name"
                required
                style={{ cursor: 'url(/type.png), auto' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurant-area">Restaurant Area</Label>
              <Input
                id="restaurant-area"
                value={restaurant.area}
                onChange={(e) => setRestaurant(prev => ({ ...prev, area: e.target.value }))}
                placeholder="Enter restaurant area"
                required
                style={{ cursor: 'url(/type.png), auto' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cuisine-type">Cuisine Type</Label>
              <Input
                id="cuisine-type"
                value={restaurant.cuisineType}
                onChange={(e) => setRestaurant(prev => ({ ...prev, cuisineType: e.target.value }))}
                placeholder="Enter cuisine type"
                required
                style={{ cursor: 'url(/type.png), auto' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number-of-people">Number of People</Label>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <Input
                  id="number-of-people"
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  required
                  style={{ cursor: 'url(/type.png), auto' }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-purchased"
              checked={hasPurchased}
              onCheckedChange={(checked) => setHasPurchased(checked as boolean)}
              style={{ cursor: 'url(/poin.png), auto' }}
            />
            <Label htmlFor="has-purchased">I have already purchased food</Label>
          </div>
          {hasPurchased && (
            <div className="space-y-2">
              <Label htmlFor="ordered-items">Ordered Items</Label>
              <div className="flex space-x-2">
                <Input
                  id="ordered-items"
                  value={newOrderedItem}
                  onChange={(e) => setNewOrderedItem(e.target.value)}
                  placeholder="Enter ordered item"
                  style={{ cursor: 'url(/type.png), auto' }}
                />
                <Button 
                  type="button" 
                  onClick={addOrderedItem} 
                  size="icon" 
                  className='bg-acc hover:bg-prim'
                  style={{ cursor: 'url(/poin.png), auto' }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="mt-2 space-y-1">
                {orderedItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-second text-secondary-foreground rounded-md px-2 py-1">
                    <span>{item}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeOrderedItem(index)}
                      style={{ cursor: 'url(/poin.png), auto' }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-prim hover:bg-acc"
            style={{ cursor: 'url(/poin.png), auto' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Suggestions...
              </>
            ) : (
              'Get Food Suggestions'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {(dishes.length > 0 || accompaniments.length > 0 || combinations.length > 0) && (
          <Tabs defaultValue="dishes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dishes" style={{ cursor: 'url(/poin.png), auto' }}>
                Dishes
              </TabsTrigger>
              <TabsTrigger value="accompaniments" style={{ cursor: 'url(/poin.png), auto' }}>
                Accompaniments
              </TabsTrigger>
              <TabsTrigger value="combinations" style={{ cursor: 'url(/poin.png), auto' }}>
                Combinations
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dishes">
              <h3 className="text-lg font-semibold mb-2">Suggested Dishes:</h3>
              <ul className="space-y-2">
                {dishes.map((dish, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2">
                    <span>{dish.name}</span>
                    <span className="text-sm text-muted-foreground">{dish.approximateCost}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="accompaniments">
              <h3 className="text-lg font-semibold mb-2">Suggested Accompaniments:</h3>
              <ul className="space-y-2">
                {accompaniments.map((item, index) => (
                  <li key={index} className="flex justify-between items-center border-b pb-2">
                    <span>{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.approximateCost}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="combinations">
              <h3 className="text-lg font-semibold mb-2">Suggested Combinations:</h3>
              <ul className="space-y-2">
                {combinations.map((combo, index) => (
                  <li key={index} className="border-b pb-2">
                    {combo}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        )}
      </CardFooter>
    </Card>
    </div>
  )
}

