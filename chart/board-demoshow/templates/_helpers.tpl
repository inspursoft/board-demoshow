{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "board-demoshow.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "board-demoshow.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}


{/*
Create a default fully qualified demoui name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "board-demoshow.demoui.fullname" -}}
{{- printf "%s-%s" (include "board-demoshow.fullname" .) .Values.demoui.name | trunc 63 | trimSuffix "-" -}}
{{- end -}} 

{/*
Create a default fully qualified democore name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "board-demoshow.democore.fullname" -}}
{{- printf "%s-%s" (include "board-demoshow.fullname" .) .Values.democore.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{/*
Create a default fully qualified demoworker name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "board-demoshow.demoworker.fullname" -}}
{{- printf "%s-%s" (include "board-demoshow.fullname" .) .Values.demoworker.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}



{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "board-demoshow.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}
