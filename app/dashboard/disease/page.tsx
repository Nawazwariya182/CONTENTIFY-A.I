'use client'

import React, { useState } from 'react'
import { getDiseasePrediction, validatePatientData, PatientData, DiseasePrediction } from '@/utils/disease'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Loader2, Plus, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link'

export default function DiseasePredictionUI() {
  const [patientData, setPatientData] = useState<PatientData>({
    age: 0,
    gender: '',
    symptoms: [],
    duration: '',
    medicalHistory: [],
    lifestyle: []
  })
  const [newSymptom, setNewSymptom] = useState('')
  const [newMedicalHistory, setNewMedicalHistory] = useState('')
  const [newLifestyle, setNewLifestyle] = useState('')
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validatePatientData(patientData)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setPrediction(null)
    setIsLoading(true)
    try {
      const result = await getDiseasePrediction(patientData)
      if (result.error) {
        setError(result.error)
      } else {
        setPrediction(result)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addSymptom = () => {
    if (newSymptom.trim() !== '') {
      setPatientData(prev => ({ ...prev, symptoms: [...prev.symptoms, newSymptom.trim()] }))
      setNewSymptom('')
    }
  }

  const removeSymptom = (index: number) => {
    setPatientData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }))
  }

  const addMedicalHistory = () => {
    if (newMedicalHistory.trim() !== '') {
      setPatientData(prev => ({ ...prev, medicalHistory: [...prev.medicalHistory, newMedicalHistory.trim()] }))
      setNewMedicalHistory('')
    }
  }

  const removeMedicalHistory = (index: number) => {
    setPatientData(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index)
    }))
  }

  const addLifestyle = () => {
    if (newLifestyle.trim() !== '') {
      setPatientData(prev => ({ ...prev, lifestyle: [...prev.lifestyle, newLifestyle.trim()] }))
      setNewLifestyle('')
    }
  }

  const removeLifestyle = (index: number) => {
    setPatientData(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.filter((_, i) => i !== index)
    }))
  }

  return (
    <div>
      <Link href="/dashboard" >
        <Button className="bg-prim mx-[350px] sm:mx-[30px] mt-2 mb-[-20px] hover:bg-back hover:text-acc hover:border-2 hover:border-prim transition-all w-20" style={{ cursor: 'url(/poin.png), auto' }}>
          <ArrowLeft className="text-xl" /> Back
        </Button>
      </Link>
    <Card className="w-full max-w-2xl mx-auto mb-20 mt-10 ">
      <CardHeader>
        <CardTitle className="text-2xl">AI Disease Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={patientData.age}
                onChange={(e) => setPatientData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                required
                style={{ cursor: 'url(/type.png), auto' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setPatientData(prev => ({ ...prev, gender: value }))} >
                <SelectTrigger style={{ cursor: 'url(/poin.png), auto' }}>
                  <SelectValue placeholder="Select gender" style={{ cursor: 'url(/poin.png), auto' }} />
                </SelectTrigger>
                <SelectContent style={{ cursor: 'url(/poin.png), auto' }}>
                  <SelectItem value="male" style={{ cursor: 'url(/poin.png), auto' }}>Male</SelectItem>
                  <SelectItem value="female" style={{ cursor: 'url(/poin.png), auto' }}>Female</SelectItem>
                  <SelectItem value="other" style={{ cursor: 'url(/poin.png), auto' }}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <div className="flex space-x-2">
              <Input
                id="symptoms"
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                placeholder="Enter a symptom"
                style={{ cursor: 'url(/type.png), auto' }}
              />
              <Button type="button" onClick={addSymptom} size="icon" className='bg-prim hover:bg-acc' style={{ cursor: 'url(/poin.png), auto' }}>
                <Plus className="h-4 w-4 " />
              </Button>
            </div>
            <ul className="mt-2 space-y-1">
              {patientData.symptoms.map((symptom, index) => (
                <li key={index} className="flex items-center justify-between bg-second text-secondary-foreground rounded-md px-2 py-1 " style={{ cursor: 'url(/poin.png), auto' }}>
                  <span>{symptom}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeSymptom(index)} style={{ cursor: 'url(/poin.png), auto' }}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration of Symptoms</Label>
            <Input
              id="duration"
              value={patientData.duration}
              onChange={(e) => setPatientData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 2 weeks"
              required
              style={{ cursor: 'url(/type.png), auto' }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medical-history">Medical History</Label>
            <div className="flex space-x-2">
              <Input
                id="medical-history"
                value={newMedicalHistory}
                onChange={(e) => setNewMedicalHistory(e.target.value)}
                placeholder="Enter medical history"
                style={{ cursor: 'url(/type.png), auto' }}
              />
              <Button type="button" onClick={addMedicalHistory} size="icon" className='bg-prim hover:bg-acc' style={{ cursor: 'url(/poin.png), auto' }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-2 space-y-1">
              {patientData.medicalHistory.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-second text-secondary-foreground rounded-md px-2 py-1" style={{ cursor: 'url(/poin.png), auto' }}>
                  <span>{item}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeMedicalHistory(index)} style={{ cursor: 'url(/poin.png), auto' }}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lifestyle">Lifestyle Factors</Label>
            <div className="flex space-x-2">
              <Input
                id="lifestyle"
                value={newLifestyle}
                onChange={(e) => setNewLifestyle(e.target.value)}
                placeholder="Enter lifestyle factor"
                style={{ cursor: 'url(/type.png), auto' }}
              />
              <Button type="button" onClick={addLifestyle} size="icon" className='bg-prim hover:bg-acc' style={{ cursor: 'url(/poin.png), auto' }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-2 space-y-1">
              {patientData.lifestyle.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-second text-secondary-foreground rounded-md px-2 py-1" style={{ cursor: 'url(/poin.png), auto' }}>
                  <span>{item}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeLifestyle(index)} style={{ cursor: 'url(/poin.png), auto' }}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-prim hover:bg-acc" style={{ cursor: 'url(/poin.png), auto' }}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Prediction...
              </>
            ) : (
              'Get Disease Prediction'
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
        {prediction && (
          <Tabs defaultValue="diseases" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diseases" style={{ cursor: 'url(/poin.png), auto' }}>Possible Diseases</TabsTrigger>
              <TabsTrigger value="tests" style={{ cursor: 'url(/poin.png), auto' }}>Recommended Tests</TabsTrigger>
              <TabsTrigger value="advice" style={{ cursor: 'url(/poin.png), auto' }}>General Advice</TabsTrigger>
            </TabsList>
            <TabsContent value="diseases">
              <h3 className="text-lg font-semibold mb-2">Possible Diseases:</h3>
              <ul className="space-y-2">
                {prediction.possibleDiseases.map((disease, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="font-medium">{disease.name} - {disease.probability}</p>
                    <p className="text-sm text-muted-foreground">{disease.description}</p>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="tests">
              <h3 className="text-lg font-semibold mb-2">Recommended Tests:</h3>
              <ul className="list-disc list-inside">
                {prediction.recommendedTests.map((test, index) => (
                  <li key={index}>{test}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="advice">
              <h3 className="text-lg font-semibold mb-2">General Advice:</h3>
              <p>{prediction.generalAdvice}</p>
            </TabsContent>
          </Tabs>
        )}
      </CardFooter>
    </Card>
    </div>
  )
}

