package main

// static directory is accessed at /
// /files redirects to /files/id
// posts to /files/id saves file
// yep

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "path"
  "math/rand"
  "strings"
)

const (
  filesDir = "files/"
  filesExt = ".asm"
)

type AsmFile struct {
  Id string
  Text []byte
}

func (af *AsmFile) Save() error {
  return ioutil.WriteFile(af.GetPath(), af.Text, 0600)
}

func (af *AsmFile) GetPath() string {
  return path.Join(filesDir, af.Id + filesExt)
}

func LoadAsmFile(id string) (*AsmFile, error) {
  af := &AsmFile{id, nil}
  filename := af.GetPath()
  var err error = nil
  af.Text, err = ioutil.ReadFile(filename)
  if err != nil {
    return nil, err
  }
  return af, nil
}

type RequestHandler struct {
  newIds chan string
}

var (
  NATURES = []string { "hardy", "lonely", "brave", "adamant", "naughty",
    "bold", "docile", "relaxed", "impish", "lax", "timid", "hasty",
    "serious", "jolly", "naive", "modest", "mild", "mild", "quiet",
    "bashful", "rash", "calm", "gentle", "sassy", "careful", "quirky",
  }
  IVS = []string {
    "perfect", "one-iv", "two-iv", "three-iv", "four-iv", "five-iv",
    "zero-iv",
  }
  POKEMON = []string {
    "bulbasaur", "ivysaur", "venasaur", "charmander", "charmeleon",
    "charizard", "squirtle", "wartortle", "blastoise", "caterpie",
    "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey",
    "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow",
    "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash",
    "nidoran", "nidorina", "nidoqueen", "nidorino", "nidoking",
    "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff",
    "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume",
    "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio",
    "meowth", "persian", "psyduck", "golduck", "mankey", "primeape",
    "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra",
    "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout",
    "weepinbell", "victreebell", "tentacool", "tentacruel", "geodude",
    "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro",
    "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel",
    "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly",
    "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler",
    "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak",
    "hitmonlee", "hitmonchan", "lickitun", "koffing", "weezing",
    "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea",
    "seadra", "goldeen", "seaking", "staryu", "starmie", "mrmime",
    "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros",
    "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon",
    "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto",
    "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres",
    "dratini", "dragonair", "dragonite", "mewtwo", "mew",
  }

)


func (handler *RequestHandler) GenerateIds() {
  for {
    nature := rand.Intn(len(NATURES))
    iv := rand.Intn(len(IVS))
    pokemon := rand.Intn(len(POKEMON))
    fmt.Println("thought of a good one: "+NATURES[nature]+"-"+IVS[iv]+"-"+POKEMON[pokemon])
    handler.newIds <- NATURES[nature]+"-"+IVS[iv]+"-"+POKEMON[pokemon]
  }
}


func (handler *RequestHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  pathComps := strings.Split(r.URL.Path, "/")
  fmt.Printf("pcLen: %d\n", len(pathComps))
  if(len(r.URL.Path) <= 1) {
    id := <- handler.newIds
    fmt.Println("Redirecting");
    af := &AsmFile{id, make([]byte, 0)}
    err := af.Save()
    if err != nil {
      http.Error(w, err.Error(), http.StatusInternalServerError)
      return
    }
    http.Redirect(w, r, "/files/"+id, http.StatusFound)
    return
  }
  id := pathComps[len(pathComps)-1]
  fmt.Println("Id: "+id)

  af, err := LoadAsmFile(id)
  if err != nil {
    fmt.Println("404")
    w.WriteHeader(404)
    return
  }

  if(pathComps[0] == "get") {
    // raw data wanted "get"
    fmt.Println("serving a get!")
    http.ServeFile(w, r, af.GetPath())
    return;
  }
  // pretty

  fmt.Println("serving file.html")
  http.ServeFile(w, r, "static/file.html")
}

func main() {
  fmt.Println("spooling up ftl drives")
  handler := &RequestHandler{make(chan string)}
  go func() {
    handler.GenerateIds()
  }()
  http.Handle("/files/", http.StripPrefix("/files/", handler))
  http.Handle("/", http.FileServer(http.Dir("static")))
  err := http.ListenAndServe(":9001", nil)

  if err != nil {
    fmt.Println("I has a sad")
  }

}


