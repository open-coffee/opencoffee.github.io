package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
)

func main() {
	var projectDescriptionFile string;
	flag.StringVar(&projectDescriptionFile, "projectFilePath", "./projects.json", "Filepath to the JSON with the project descriptions")
	flag.Parse()

	pdd := ProjectDescriptionsDownloader{}
	pdd.Initialise(projectDescriptionFile)
	pdd.Execute()
}

type ProjectDescriptionsDownloader struct {
	ProjectsDescriptions ProjectDescriptions
}

func (d *ProjectDescriptionsDownloader) Initialise(fileUrl string) {

	projectsJson, err := ioutil.ReadFile(fileUrl)
	checkErr(err)

	projectDescriptions := ProjectDescriptions{}
	err = json.Unmarshal(projectsJson, &projectDescriptions)
	checkErr(err)

	d.ProjectsDescriptions = projectDescriptions
	fmt.Println("Initialized ProjectDescriptions list\n")
}

func (d *ProjectDescriptionsDownloader) Execute() {

	for _, project := range d.ProjectsDescriptions.ProjectDescriptions {
		err := project.Hydrate()
		checkErr(err)

		project.Write()
	}
}

type ProjectDescriptions struct {
	ProjectDescriptions []ProjectDescription
}

type ProjectDescription struct {
	Lines  []string
	Url    string
	Base   string
	Name   string
	Path   string
	Title  string
	Weight int
}

func (p *ProjectDescription) Hydrate() error {

	if p.Url == "" {
		return nil
	}

	// Get the data
	response, err := http.Get(p.Url)
	checkErr(err)
	defer response.Body.Close()

	buf := new(bytes.Buffer)
	buf.ReadFrom(response.Body)

	p.Lines = strings.Split(buf.String(), "\n")
	fmt.Println("Hydrated ProjectDescription of", p.Name)

	return nil
}

func (p *ProjectDescription) Write() {

	// Create paths
	os.MkdirAll(p.Path, os.ModePerm);

	// Create the file
	out, err := os.Create(p.Path + "/" + p.Name)
	checkErr(err)
	defer out.Close()

	preparedText := prepareHugoInformation(p)

	w := bufio.NewWriter(out)
	for _, line := range preparedText {
		fmt.Fprintln(w, line)
	}
	w.Flush()

	fmt.Println("Wrote", p.Name, "to", p.Path, "\n")
}

func prepareHugoInformation(p *ProjectDescription) []string {

	var preparedText = p.Lines
	preparedText = append([]string{"+++\n"}, preparedText...)
	preparedText = append([]string{"githubUrl = \"" + p.Base + "\""}, preparedText...)
	preparedText = append([]string{"weight = " + strconv.Itoa(p.Weight)}, preparedText...)
	preparedText = append([]string{"title = \"" + p.Title + "\""}, preparedText...)
	preparedText = append([]string{"+++"}, preparedText...)

	fmt.Println("Added hugo header to", p.Name)

	return preparedText
}

func checkErr(err error) {
	if err != nil {
		log.Fatal("x>", err)
	}
}
